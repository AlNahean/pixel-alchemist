'use client';

import { Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { useTexture, Html as DreiHtml } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Image as ImageIcon, Loader2, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as THREE from 'three/webgpu';
import {
    abs, blendScreen, float, Fn, max, mod, oneMinus, select,
    smoothstep, sub, texture, uniform, uv, vec2, vec3, mx_cell_noise_float
} from 'three/tsl';
import { WebGPUCanvas } from '@/components/canvas';
import { PostProcessing } from '@/components/post-processing';


// My main switch for turning the upload feature on or off.
// If I set this to 'false', the app will only show the demo image and hide all upload UI.
const ALLOW_IMAGE_UPLOADING = false;

// Here's the config for the default images that load on startup.
// I need to make sure these files are in the `public` folder and that I get the
// image dimensions right, otherwise the aspect ratio will be weird.
const DEMO_IMAGE_CONFIG = {
    urls: {
        original_url: '/demo-image.png',
        depth_map_url: '/demo-image-depthmap.png',
        edge_map_url: '/demo-image-edgemap.png',
    },
    dimensions: {
        width: 800,
        height: 1200,
    },
};


// Scales a plane to fit the viewport while maintaining aspect ratio ("contain").
const useContainScaling = (imageDimensions) => {
    const { viewport } = useThree();
    return useMemo(() => {
        if (!imageDimensions || !viewport.width || !viewport.height) return [1, 1];
        const viewportAspect = viewport.width / viewport.height;
        const imageAspect = imageDimensions.width / imageDimensions.height;
        if (imageAspect > viewportAspect) {
            return [viewport.width, viewport.width / imageAspect];
        } else {
            return [viewport.height * imageAspect, viewport.height];
        }
    }, [viewport.width, viewport.height, imageDimensions]);
};

// I made this simple component just to show a quick preview of the user's image.
// It uses a basic material so it won't be affected by my fancy post-processing effects.
// `toneMapped=false` is key here to make sure the preview image's colors look correct.
const ImagePreviewScene = ({ url, dimensions }) => {
    const texture = useTexture(url);
    const [width, height] = useContainScaling(dimensions);
    return (
        <mesh scale={[width, height, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
};

// Common uniforms for shaders.
const commonUniforms = () => ({
    uPointer: uniform(new THREE.Vector2(0)),
    uProgress: uniform(0),
});

// Shared GSAP animation and pointer tracking logic.
const useCommonEffects = (uniforms, customGsap = null) => {
    useGSAP(() => {
        gsap.to(uniforms.uProgress, {
            value: 1, repeat: -1, duration: 3, ease: 'power1.out', ...(customGsap ? customGsap(uniforms.uProgress) : {})
        });
    }, [uniforms, customGsap]);

    useFrame(({ pointer }) => {
        uniforms.uPointer.value.lerp(pointer, 0.05);
    });
};

// SDF for a cross shape.
const sdCross = Fn(([p_immutable, b_immutable, r_immutable]) => {
    const p = vec2(p_immutable).toVar(); const b = vec2(b_immutable).toVar(); const r = float(r_immutable).toVar();
    p.assign(abs(p)); p.assign(select(p.y.greaterThan(p.x), p.yx, p.xy));
    const q = vec2(p.sub(b)).toVar(); const k = float(max(q.y, q.x)).toVar();
    const w = vec2(select(k.greaterThan(0.0), q, vec2(b.y.sub(p.x), k.negate()))).toVar();
    const d = float(max(w, 0.0).length()).toVar();
    return select(k.greaterThan(0.0), d, d.negate()).add(r);
});

// Generic component to render a plane with a TSL shader.
const ShaderScene = ({ imageUrls, imageDimensions, colorNodeFn, customGsap }) => {
    const textureUrls = [imageUrls.original_url, imageUrls.depth_map_url];
    if (imageUrls.edge_map_url) textureUrls.push(imageUrls.edge_map_url);
    const textures = useTexture(textureUrls);
    textures[0].colorSpace = THREE.SRGBColorSpace;
    const [width, height] = useContainScaling(imageDimensions);
    const { material, uniforms } = useMemo(() => {
        const u = commonUniforms();
        const finalColorNode = colorNodeFn({ uniforms: u, textures, imageDimensions });
        const material = new THREE.MeshBasicNodeMaterial({ colorNode: finalColorNode });
        return { material, uniforms: u };
    }, [textures, imageDimensions, colorNodeFn]);
    useCommonEffects(uniforms, customGsap);
    return <mesh scale={[width, height, 1]} material={material}><planeGeometry /></mesh>;
};

// Centralized definitions for all shader effects.
const effects = [
    {
        id: 'cellNoise', name: 'Cell Noise', colorNodeFn: ({ uniforms, textures, imageDimensions }) => {
            const [rawMap, depthMap] = textures; const { uProgress, uPointer } = uniforms; const tDepthMap = texture(depthMap); const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(0.01))); const aspect = float(imageDimensions.width).div(imageDimensions.height); const tUv = vec2(uv().x.mul(aspect), uv().y); const tiling = vec2(120.0); const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0); const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2)); const dist = float(tiledUv.length()); const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness); const flow = oneMinus(smoothstep(0, 0.02, abs(tDepthMap.sub(uProgress)))); const mask = dot.mul(flow).mul(vec3(10, 0, 0)); return blendScreen(tMap, mask);
        },
    },
    {
        id: 'edge', name: 'Edge Flow', colorNodeFn: ({ uniforms, textures }) => {
            const [rawMap, depthMap, edgeMap] = textures; const { uProgress, uPointer } = uniforms; const tDepthMap = texture(depthMap); const tEdgeMap = texture(edgeMap); const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(0.01))).mul(0.5); const flow = sub(1, smoothstep(0, 0.02, abs(tDepthMap.sub(uProgress)))); const mask = oneMinus(tEdgeMap).mul(flow).mul(vec3(10, 0.4, 10)); return blendScreen(tMap, mask);
        },
    },
    {
        id: 'sdfCross', name: 'SDF Cross', colorNodeFn: ({ uniforms, textures, imageDimensions }) => {
            const [rawMap, depthMap] = textures; const { uProgress, uPointer } = uniforms; const tDepthMap = texture(depthMap); const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(0.01))).mul(0.5); const aspect = float(imageDimensions.width).div(imageDimensions.height); const tUv = vec2(uv().x.mul(aspect), uv().y); const tiling = vec2(50.0); const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0); const dist = sdCross(tiledUv, vec2(0.3, 0.02), 0.0); const cross = vec3(smoothstep(0.0, 0.02, dist)); const depth = oneMinus(tDepthMap); const flow = sub(1, smoothstep(0, 0.02, abs(depth.sub(uProgress)))); const mask = oneMinus(cross).mul(flow).mul(vec3(10, 10, 10)); return blendScreen(tMap, mask);
        },
        customGsap: () => ({ value: 0.9, yoyo: true })
    },
];

// Collapsible UI panel for controls.
const ControlsPanel = ({ isLoading, file, imageConfig, activeEffectId, onFileChange, onSubmit, onEffectChange, allowUploading, hasPreview }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    return (
        <div className="absolute top-0 left-0 z-10 p-4 sm:p-8">
            <div className="relative flex items-start gap-4">
                <Button variant="outline" size="icon" onClick={() => setIsPanelOpen(!isPanelOpen)} className="z-20 flex-shrink-0 bg-background/80 backdrop-blur-sm" aria-label="Toggle controls panel">
                    <SlidersHorizontal className="h-5 w-5" />
                </Button>
                <div className={cn("transition-all duration-300 ease-in-out", isPanelOpen ? "w-full max-w-md opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 pointer-events-none")}>
                    <Card className="w-full bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">Pixel Alchemist</CardTitle>
                            <CardDescription>{allowUploading ? "Upload an image to apply effects, or play with the demo." : "Interact with the demo effect."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {allowUploading && (
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="picture">Image File</Label>
                                    <div className="flex w-full items-center gap-2">
                                        <Input id="picture" type="file" accept="image/png, image/jpeg" onChange={onFileChange} className="flex-grow" />
                                        <Button onClick={onSubmit} disabled={isLoading || !file}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Generate
                                        </Button>
                                    </div>
                                    {hasPreview && !isLoading && <p className="text-sm text-muted-foreground">Previewing image. Click Generate to apply effects.</p>}
                                </div>
                            )}
                            {(imageConfig?.urls || hasPreview) && (
                                <div className="space-y-2">
                                    <Label>Select Effect</Label>
                                    <ToggleGroup type="single" variant="outline" value={activeEffectId} onValueChange={onEffectChange} className="flex-wrap justify-start">
                                        {effects.map((effect) => (<ToggleGroupItem key={effect.id} value={effect.id} aria-label={effect.name}>{effect.name}</ToggleGroupItem>))}
                                    </ToggleGroup>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeEffectId, setActiveEffectId] = useState(effects[0].id);
    const [isDragging, setIsDragging] = useState(false);

    // This state holds the final, processed image data from my backend. It starts with the demo.
    const [imageConfig, setImageConfig] = useState(DEMO_IMAGE_CONFIG);
    // This state is just for the temporary preview of the user's upload. It's null most of the time.
    const [preview, setPreview] = useState(null);

    // This is a super important hook to prevent memory leaks.
    // When the `preview` state changes or the component unmounts, I need to clean up the
    // old blob URL that I created. The return function here does exactly that.
    useEffect(() => {
        const urlToRevoke = preview?.url;
        return () => {
            if (urlToRevoke) {
                URL.revokeObjectURL(urlToRevoke);
            }
        };
    }, [preview]);

    // This function handles the first step of an upload: validating the file
    // and creating a temporary preview.
    const processFile = useCallback((fileToProcess) => {
        if (!ALLOW_IMAGE_UPLOADING || !fileToProcess) return;

        if (!['image/jpeg', 'image/png'].includes(fileToProcess.type)) { toast.error('Invalid file type: JPG or PNG only.'); return; }
        if (fileToProcess.size > 5 * 1024 * 1024) { toast.error("File size cannot exceed 5MB."); return; }

        setFile(fileToProcess);
        setImageConfig(null); // Clear out the old final image/effect

        const url = URL.createObjectURL(fileToProcess);
        const img = new Image();
        img.onload = () => {
            // Once the image is loaded in the browser, set the preview state.
            // This will trigger the canvas to show the ImagePreviewScene.
            setPreview({ url, dimensions: { width: img.naturalWidth, height: img.naturalHeight } });
        };
        img.onerror = () => {
            toast.error("Could not read the image file.");
            URL.revokeObjectURL(url);
            setFile(null);
        };
        img.src = url;
    }, []);

    // This function does the heavy lifting: sending the file to the backend.
    // It only runs when the "Generate" button is clicked.
    const handleSubmit = useCallback(async () => {
        if (!file) { toast.warning("Please select an image file first."); return; }
        setIsLoading(true);
        toast.info("Generating effects... This may take a moment.");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/process-image/';
            const response = await fetch(apiUrl, { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
            const data = await response.json();

            // Success! Set the final image config and clear the preview state.
            // This is the magic that swaps the preview for the final effect scene.
            setImageConfig({ urls: data, dimensions: preview.dimensions });
            setPreview(null);

            toast.success("Effect generated successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            toast.error(`Processing failed: ${errorMessage}`);
            // If it fails, I need to clean up and reset to a predictable state.
            setPreview(null);
            setImageConfig(ALLOW_IMAGE_UPLOADING ? null : DEMO_IMAGE_CONFIG); // Go back to dropzone or demo
            setFile(null);
        } finally {
            setIsLoading(false);
        }
    }, [file, preview]);

    const handleFileChange = (e) => {
        processFile(e.target.files?.[0]);
        e.target.value = '';
    };

    const handleDrag = useCallback((e) => {
        if (!ALLOW_IMAGE_UPLOADING) return;
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        if (!ALLOW_IMAGE_UPLOADING) return;
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        processFile(e.dataTransfer.files?.[0]);
    }, [processFile]);



    const activeEffectDef = effects.find((e) => e.id === activeEffectId);
    // I only want to add drag-and-drop listeners if uploading is actually enabled.
    const dragProps = ALLOW_IMAGE_UPLOADING ? { onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop } : {};

    // A simple flag to decide if the dropzone should be visible.
    const showDropzone = !preview && !imageConfig?.urls;

    return (
        <main {...dragProps}>
            <Toaster richColors position="top-center" />
            <ControlsPanel
                isLoading={isLoading}
                file={file}
                imageConfig={imageConfig}
                activeEffectId={activeEffectId}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                onEffectChange={(value) => { if (value) setActiveEffectId(value); }}
                allowUploading={ALLOW_IMAGE_UPLOADING}
                hasPreview={!!preview}
            />

            {/*
              This is the big fix for the runtime error. I'm keeping the canvas in the DOM *at all times*.
              This prevents the WebGPU/WebGL context from being destroyed and recreated, which was
              causing the 'getSupportedExtensions' error.
            */}
            <div className="fixed top-0 left-0 w-full h-svh -z-10 bg-black">
                <WebGPUCanvas>
                    <Suspense fallback={<DreiHtml center><div className="text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Scene...</div></DreiHtml>}>
                        <PostProcessing />
                        {preview ? (
                            // If a preview exists, show the simple preview scene.
                            <ImagePreviewScene url={preview.url} dimensions={preview.dimensions} />
                        ) : imageConfig?.urls && activeEffectDef ? (
                            // Otherwise, if we have the final processed URLs, show the fancy effect scene.
                            <ShaderScene imageUrls={imageConfig.urls} imageDimensions={imageConfig.dimensions} colorNodeFn={activeEffectDef.colorNodeFn} customGsap={activeEffectDef.customGsap} />
                        ) : null /* If neither, render nothing in the canvas; the dropzone overlay will be visible. */}
                    </Suspense>
                </WebGPUCanvas>
            </div>

            {/*
              The dropzone is now just an overlay. It only shows up if uploading is on AND
              there's no preview or final image currently being displayed.
            */}
            {ALLOW_IMAGE_UPLOADING && showDropzone && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4">
                    <div className={cn("w-full h-full border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 transition-all duration-300", { "border-primary scale-105 bg-primary/10": isDragging })}>
                        <ImageIcon className={cn("w-16 h-16 mb-4 transition-transform", { "scale-110": isDragging })} />
                        <h2 className="text-2xl font-semibold text-gray-400 text-center">{isDragging ? "Drop your image here!" : "Drag & Drop an Image"}</h2>
                        <p className="mt-2 text-center">or use the uploader in the top-left corner.</p>
                    </div>
                </div>
            )}
        </main>
    );
}