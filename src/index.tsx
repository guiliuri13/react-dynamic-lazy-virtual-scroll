import React, {
	useEffect,
	useRef,
	useState,
	RefObject,
	UIEvent,
	ReactNode,
	FC,
	useMemo,
	forwardRef,
} from "react";
import { isInView } from "./utils";

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

const VirtualScroll: FC<VirtualScrollProps> = ({
	totalLength,
	length = 30,
	buffer = 10,
	minItemHeight = 50,
	offset = 0,
	forwardRef,
	renderItem,
	onScroll,
	...rest
}) => {
	const [state, setState] = useState({ offset });
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [avgRowHeight, setAvgRowHeight] = useState(minItemHeight);

	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = state.offset * avgRowHeight;
		}
	}, [state.offset, avgRowHeight]);

	useEffect(() => {
		if (state.offset < 0) {
			setState({ offset: 0 });
		} else if (state.offset > totalLength - length) {
			setState({ offset: totalLength - length });
		}
	}, [totalLength, length, state.offset]);

	useEffect(() => {
		const handleScroll = (event: Event) => {
			if (listRef.current) {
				const { scrollTop } = listRef.current;
				const direction = Math.floor(scrollTop - lastScrollTop);

				if (direction === 0) return;

				const items = listRef.current.querySelectorAll(".VS-item");
				let newOffset = state.offset;
				let newAvgRowHeight = avgRowHeight;
				const start = Math.min(state.offset, buffer);

				if (direction > 0) {
					if (state.offset < totalLength - length) {
						let heightAdded = 0;
						for (let i = start; i < items.length; i++) {
							const inView = isInView(listRef.current, items[i]);
							const rowHeight = items[i].clientHeight;
							if (!inView) {
								heightAdded += rowHeight;
								newOffset++;
							} else {
								break;
							}
						}
						if (heightAdded < direction) {
							const heightLeft = direction - heightAdded;
							const offsetToBeAdded = Math.floor(
								heightLeft / minItemHeight
							);
							newOffset += offsetToBeAdded;
							heightAdded += offsetToBeAdded * minItemHeight;
						}
						newAvgRowHeight =
							newOffset > 0
								? (state.offset * avgRowHeight + heightAdded) /
								  newOffset
								: minItemHeight;

						setState({
							offset: Math.min(newOffset, totalLength - length),
						});
						setAvgRowHeight(
							Math.max(minItemHeight, newAvgRowHeight)
						);
					}
				} else {
					const scrollDiff =
						items[start].getBoundingClientRect().y -
						listRef.current.getBoundingClientRect().y;
					if (scrollDiff > 0) {
						const offsetDiff =
							Math.floor(scrollDiff / minItemHeight) || 1;
						const newOffset = state.offset - offsetDiff;
						if (newOffset < totalLength - (length + buffer)) {
							setState({ offset: Math.max(0, newOffset) });
						}
					}
				}
			}
		};

		if (listRef.current) {
			listRef.current.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (listRef.current) {
				listRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, [
		state.offset,
		avgRowHeight,
		lastScrollTop,
		totalLength,
		length,
		buffer,
		minItemHeight,
	]);

	const start = Math.max(0, state.offset - buffer);
	const end = Math.min(state.offset + (length + buffer) - 1, totalLength - 1);

	const topPadding = Math.max(0, start * avgRowHeight);
	const bottomPadding = Math.max(0, (totalLength - end - 1) * avgRowHeight);

	const renderedItems = useMemo(() => {
		const items = [];

		// for (let i = start; i <= end; i++) {
		//   if (isInView(i, currentOffset, length, buffer)) {
		// 	items.push(renderItem(i));
		//   }
		// }

		return items;
	}, [start, end, state.offset, length, buffer, renderItem]);

	return (
		<div {...rest} ref={forwardRef}>
			<div
				style={{
					flexShrink: 0,
					height: topPadding,
				}}
			/>
				{/* {renderedItems} */}
			<div
				style={{
					flexShrink: 0,
					height: bottomPadding,
				}}
			/>
		</div>
	);
};

export default forwardRef(
	(
		props: VirtualScrollProps,
		ref: any
	) => <VirtualScroll key={props.totalLength} forwardRef={ref} {...props} />
);
