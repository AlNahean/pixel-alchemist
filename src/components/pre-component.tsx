import { extractTextFromChildren } from '@/lib/extractText';
import { CopyButton } from './copy-button';

export const Pre = ({ children, ...props }: any) => {
    const textToCopy = extractTextFromChildren(children);

    return (
        <div className="relative">
            <CopyButton text={textToCopy} />
            <pre {...props} className='!dark:bg-muted/30  p-4 rounded-md'>{children}</pre>
        </div>
    );
};