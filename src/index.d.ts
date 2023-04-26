export interface VirtualScrollProps {
	totalLength: number;
	length?: number;
	buffer?: number;
	minItemHeight?: number;
	offset?: number;
	forwardRef?: RefObject<HTMLDivElement> | null;
	renderItem: (index: number) => ReactNode;
	onScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

export declare function VirtualScroll(props: VirtualScrollProps): JSX.Element;