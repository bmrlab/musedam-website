import { cn } from "@/utilities/cn";
import React from "react";
import { AnchorLinkHandler } from "@/components/AnchorLinkHandler";

import { serializeLexical } from "./serialize";

type Props = {
	className?: string;
	content: Record<string, any>;
	enableGutter?: boolean;
	enableProse?: boolean;
};

const RichText: React.FC<Props> = ({
	className,
	content,
	enableGutter = true,
	enableProse = true,
}) => {
	if (!content) {
		return null;
	}

	return (
		<div
			className={cn(
				{
					"container ": enableGutter,
					"max-w-none": !enableGutter,
					// 只在明确启用时使用 prose 类，否则使用我们的自定义样式
					"prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded":
						enableProse,
					// 当禁用 prose 时，添加基础间距
					"space-y-3": !enableProse,
				},
				className,
			)}
		>
			<AnchorLinkHandler />
			{content &&
				!Array.isArray(content) &&
				typeof content === "object" &&
				"root" in content &&
				serializeLexical({ nodes: content?.root?.children })}
		</div>
	);
};

export default RichText;
