# 模块图标来源

从 `tezign-intelligence-frontend-minidam/packages/shared/icons/svgs` 逐个复用 MuseDAM 自有 SVG（不复制图标框架或建立跨仓运行依赖）。来源 commit：ed4f3abc4。

主导航映射参考 `components-view/AppHome/useHomeBarMenus.tsx`：素材库 folderFilled、合规检测 security-scan、AI 打标 tagsFill；元数据参考 `hooks/useDashboardMenu.tsx` 的 fields。其他模块从该图标集选择语义一致的图标；没有独立图标的模块复用同类图标。可在上传页选择覆盖，记录图标 ID，不接受任意 SVG/HTML。

资产数据分析复用素材库 `useDashboardMenu.tsx` 使用的 Ant Design `PieChartOutlined`，SVG 来自现有 `@ant-design/icons-svg` 包（MIT）。
