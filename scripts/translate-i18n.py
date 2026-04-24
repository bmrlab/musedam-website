#!/usr/bin/env python3
"""
MuseDAM 翻译脚本：将 en-US 翻译文件通过 Dify 工作流翻译成 zh-TW 繁体中文

使用方法:
  python translate-i18n.py --api-key YOUR_API_KEY --workflow-id YOUR_WORKFLOW_ID
  python translate-i18n.py --api-key YOUR_API_KEY --workflow-id ID --file landing-page.json
  python translate-i18n.py --api-key YOUR_API_KEY --workflow-id ID --dry-run

环境变量:
  DIFY_API_KEY   - Dify API Key
  DIFY_WORKFLOW_ID - Dify Workflow ID
  DIFY_BASE_URL  - Dify API 地址 (默认: https://api.dify.ai/v1)
  DIFY_USER      - Dify 所需的 user 标识（可选，默认: i18n-script）
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Optional

import requests


# 配置
DEFAULT_DIFY_URL = "https://dify.tezign.com/v1"
SOURCE_DIR = Path(__file__).parent.parent / "src" / "app" / "i18n" / "locales" / "en-US"
ZH_TW_TARGET_DIR = Path(__file__).parent.parent / "src" / "app" / "i18n" / "locales" / "zh-TW"


class DifyTranslator:
    """Dify 工作流翻译客户端"""

    def __init__(self, api_key: str, workflow_id: str, base_url: str = DEFAULT_DIFY_URL):
        self.api_key = api_key
        self.workflow_id = workflow_id
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def translate_json(self, json_content: str, filename: str = "") -> dict:
        """
        调用 Dify 工作流翻译 JSON 内容

        Args:
            json_content: 要翻译的 JSON 字符串
            filename: 文件名（用于上下文参考）

        Returns:
            翻译结果字典，格式为与输入 JSON 结构一致的 zh-TW 繁体中文内容
        """
        # 工作流执行端点（参考文档：POST {base_url}/workflows/run）
        url = f"{self.base_url}/workflows/run"

        # 构建请求体
        payload = {
            "inputs": {
                "input_json": json_content,
                "filename": filename,
            },
            "response_mode": "blocking",  # 同步模式，等待完成
            # Dify 私有部署通常要求提供 user 字段，这里使用环境变量或默认值
            "user": os.environ.get("DIFY_USER", "i18n-script"),
        }

        response = requests.post(url, headers=self.headers, json=payload, timeout=300)

        # 如果状态码不是 200，打印出 Dify 的错误信息方便排查
        if response.status_code != 200:
            print("  Dify 返回错误状态码:", response.status_code)
            try:
                print("  Dify 返回内容:", response.json())
            except Exception:
                print("  Dify 返回内容(非 JSON):", response.text)
            response.raise_for_status()

        result = response.json()

        # 解析工作流输出
        if "data" in result and "outputs" in result["data"]:
            outputs = result["data"]["outputs"]

            # 情况 1：工作流将结果放在 translated_json 字段中
            if "translated_json" in outputs:
                translated = outputs["translated_json"]

                if isinstance(translated, str):
                    translated_json_str = self._clean_json_response(translated)
                    return json.loads(translated_json_str)

                if isinstance(translated, dict):
                    return translated

            # 情况 2：工作流直接用 text 字段输出 JSON 字符串（当前你的工作流就是这种）
            if "text" in outputs:
                translated_text = outputs["text"]
                if isinstance(translated_text, str):
                    translated_json_str = self._clean_json_response(translated_text)
                    return json.loads(translated_json_str)

        raise ValueError(f"Unexpected response format: {result}")

    @staticmethod
    def _clean_json_response(response: str) -> str:
        """清理 LLM 返回的可能包含的 markdown 代码块"""
        response = response.strip()

        # 移除 markdown 代码块标记
        if response.startswith("```json"):
            response = response[7:]
        elif response.startswith("```"):
            response = response[3:]

        if response.endswith("```"):
            response = response[:-3]

        return response.strip()


def get_json_files(source_dir: Path, specific_file: Optional[str] = None) -> list[Path]:
    """获取要翻译的 JSON 文件列表"""
    if specific_file:
        file_path = source_dir / specific_file
        if not file_path.exists():
            print(f"错误: 文件不存在: {file_path}")
            sys.exit(1)
        return [file_path]

    # 获取所有 JSON 文件
    json_files = sorted(source_dir.glob("*.json"))

    if not json_files:
        print(f"警告: 在 {source_dir} 中没有找到 JSON 文件")
        sys.exit(1)

    return json_files


def save_zh_tw_file(target_dir: Path, filename: str, content: dict) -> None:
    """保存 zh-TW 翻译文件"""
    target_dir.mkdir(parents=True, exist_ok=True)

    target_file = target_dir / filename

    # 使用与源文件相同的缩进格式（2空格）
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"  ✓ 已保存 zh-TW: {target_file}")


def count_keys(obj, count=0):
    """递归计算 JSON 对象中的键数量"""
    if isinstance(obj, dict):
        for key, value in obj.items():
            count += 1
            if isinstance(value, (dict, list)):
                count = count_keys(value, count)
    elif isinstance(obj, list):
        for item in obj:
            count = count_keys(item, count)
    return count


def main():
    parser = argparse.ArgumentParser(
        description="将 MuseDAM en-US 翻译文件翻译成 zh-TW 繁体中文",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 翻译所有文件
  python translate-i18n.py --api-key xxx --workflow-id yyy

  # 只翻译特定文件
  python translate-i18n.py --api-key xxx --workflow-id yyy --file landing-page.json

  # 测试模式（不调用 API，只显示会处理的文件）
  python translate-i18n.py --api-key xxx --workflow-id yyy --dry-run

  # 从环境变量读取配置
  export DIFY_API_KEY=xxx
  export DIFY_WORKFLOW_ID=yyy
  python translate-i18n.py
        """,
    )

    parser.add_argument(
        "--api-key",
        default=os.environ.get("DIFY_API_KEY"),
        help="Dify API Key (或设置 DIFY_API_KEY 环境变量)",
    )
    parser.add_argument(
        "--workflow-id",
        default=os.environ.get("DIFY_WORKFLOW_ID"),
        help="Dify Workflow ID (或设置 DIFY_WORKFLOW_ID 环境变量)",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("DIFY_BASE_URL", DEFAULT_DIFY_URL),
        help=f"Dify API 地址 (默认: {DEFAULT_DIFY_URL})",
    )
    parser.add_argument(
        "--file",
        help="只翻译特定文件（如 landing-page.json）",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="测试模式：显示会处理的文件但不调用 API",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="每次 API 调用之间的延迟（秒），默认 1.0",
    )
    parser.add_argument(
        "--continue-on-error",
        action="store_true",
        help="遇到错误时继续处理其他文件",
    )

    args = parser.parse_args()

    # 验证必要参数
    if not args.api_key:
        print("错误: 请提供 --api-key 或设置 DIFY_API_KEY 环境变量")
        sys.exit(1)

    if not args.workflow_id:
        print("错误: 请提供 --workflow-id 或设置 DIFY_WORKFLOW_ID 环境变量")
        sys.exit(1)

    # 检查源目录
    if not SOURCE_DIR.exists():
        print(f"错误: 源目录不存在: {SOURCE_DIR}")
        sys.exit(1)

    # 获取要处理的文件
    json_files = get_json_files(SOURCE_DIR, args.file)

    print(f"源目录: {SOURCE_DIR}")
    print("目标语言: zh-TW (1 种)")
    print(f"Dify API: {args.base_url}")
    print(f"工作流 ID: {args.workflow_id}")
    print(f"文件数量: {len(json_files)}")
    print("-" * 50)

    if args.dry_run:
        print("【测试模式】以下文件将被处理:")
        for f in json_files:
            content = json.loads(f.read_text(encoding="utf-8"))
            key_count = count_keys(content)
            print(f"  - {f.name} (约 {key_count} 个键)")
        print("\n预期输出目录结构:")
        print(f"  {ZH_TW_TARGET_DIR}/")
        print("\n测试完成，没有调用 API")
        return

    # 初始化翻译客户端
    translator = DifyTranslator(args.api_key, args.workflow_id, args.base_url)

    # 处理统计
    success_count = 0
    error_count = 0
    total_files_generated = 0

    # 处理每个文件
    for i, file_path in enumerate(json_files, 1):
        filename = file_path.name
        print(f"\n[{i}/{len(json_files)}] 处理: {filename}")

        try:
            # 读取源文件
            source_content = file_path.read_text(encoding="utf-8")
            source_data = json.loads(source_content)

            # 调用 Dify 翻译
            print("  → 调用 Dify 工作流 (zh-TW)...")
            zh_tw_data = translator.translate_json(source_content, filename)

            if not isinstance(zh_tw_data, dict):
                raise ValueError("翻译结果不是有效的 JSON 对象")

            # 保存 zh-TW 翻译文件
            save_zh_tw_file(ZH_TW_TARGET_DIR, filename, zh_tw_data)

            total_files_generated += 1
            print("  ✓ 完成 zh-TW 翻译")
            success_count += 1

            # 添加延迟避免速率限制
            if i < len(json_files) and args.delay > 0:
                time.sleep(args.delay)

        except json.JSONDecodeError as e:
            print(f"  ✗ JSON 解析错误: {e}")
            error_count += 1
            if not args.continue_on_error:
                sys.exit(1)

        except requests.exceptions.RequestException as e:
            print(f"  ✗ API 请求错误: {e}")
            error_count += 1
            if not args.continue_on_error:
                sys.exit(1)

        except Exception as e:
            print(f"  ✗ 错误: {e}")
            error_count += 1
            if not args.continue_on_error:
                sys.exit(1)

    # 输出统计
    print("\n" + "=" * 50)
    print("处理完成!")
    print(f"  成功文件: {success_count}/{len(json_files)}")
    print(f"  失败文件: {error_count}")
    print(f"  生成 zh-TW 文件总数: {total_files_generated}")
    print(f"\n翻译文件保存在: {ZH_TW_TARGET_DIR}")

    if error_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
