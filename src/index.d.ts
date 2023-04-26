export interface VirtualScrollProps extends React.HTMLAttributes<HTMLDivElement> {
	totalLength: number;
	length?: number;
	buffer?: number;
	minItemHeight?: number;
	offset?: number;
	forwardRef?: RefObject<HTMLDivElement> | null;
	renderItem: (index: number) => ReactNode;
	onScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

export default class VirtualScroll extends React.Component<VirtualScrollProps> {}
