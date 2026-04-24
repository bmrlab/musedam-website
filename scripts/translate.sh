#!/bin/bash
# MuseDAM 翻译脚本 - 简化调用版本（当前仅支持 zh-TW）
# 使用方式: ./translate.sh [命令] [选项]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/translate-i18n.py"

# 显示帮助
show_help() {
    cat << EOF
MuseDAM 繁体中文翻译脚本 (zh-TW)

使用方法:
  ./translate.sh [命令] [选项]

命令:
  all                       翻译所有文件到繁体中文 (默认)
  file <name>               翻译特定文件到繁体中文
  zh-tw [file]              同 all/file，快捷命令
  test                      测试模式 (不调用 API)
  check                     检查配置
  help                      显示帮助

环境变量:
  DIFY_API_KEY       - Dify API Key (必需)
  DIFY_WORKFLOW_ID   - Dify Workflow ID (必需)
  DIFY_BASE_URL      - Dify API 地址 (可选, 默认: https://api.dify.ai/v1)

示例:
  # 设置环境变量
  export DIFY_API_KEY="your-api-key"
  export DIFY_WORKFLOW_ID="your-workflow-id"

  # 翻译所有文件到繁体中文
  ./translate.sh all

  # 只翻译 landing-page.json
  ./translate.sh file landing-page.json

  # 同上，快捷命令
  ./translate.sh zh-tw landing-page.json

  # 测试模式
  ./translate.sh test

  # 检查配置
  ./translate.sh check

EOF
}

# 检查 Python 依赖
check_dependencies() {
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}错误: 未找到 python3${NC}"
        exit 1
    fi

    if ! python3 -c "import requests" 2>/dev/null; then
        echo -e "${YELLOW}正在安装依赖...${NC}"
        pip3 install -r "$SCRIPT_DIR/requirements.txt"
    fi
}

# 检查环境变量
check_env() {
    if [ -z "$DIFY_API_KEY" ]; then
        echo -e "${RED}错误: 未设置 DIFY_API_KEY 环境变量${NC}"
        echo "请运行: export DIFY_API_KEY='your-api-key'"
        return 1
    fi

    if [ -z "$DIFY_WORKFLOW_ID" ]; then
        echo -e "${RED}错误: 未设置 DIFY_WORKFLOW_ID 环境变量${NC}"
        echo "请运行: export DIFY_WORKFLOW_ID='your-workflow-id'"
        return 1
    fi

    return 0
}

# 检查配置
check_config() {
    echo -e "${GREEN}配置检查:${NC}"
    echo "  DIFY_API_KEY: ${DIFY_API_KEY:+已设置 (长度: ${#DIFY_API_KEY})}"
    echo "  DIFY_WORKFLOW_ID: ${DIFY_WORKFLOW_ID:-未设置}"
    echo "  DIFY_BASE_URL: ${DIFY_BASE_URL:-https://api.dify.ai/v1 (默认)}"

    check_dependencies

    if check_env; then
        echo -e "${GREEN}✓ 配置正常${NC}"
        return 0
    else
        return 1
    fi
}

# 运行 Python 脚本
run_python() {
    check_dependencies

    if ! check_env; then
        exit 1
    fi

    python3 "$PYTHON_SCRIPT" "$@"
}

# 主命令处理
case "${1:-all}" in
    all)
        echo -e "${GREEN}开始翻译所有文件到繁体中文...${NC}"
        run_python
        ;;
    file)
        if [ -z "$2" ]; then
            echo -e "${RED}错误: 请指定文件名${NC}"
            echo "用法: ./translate.sh file <filename.json>"
            exit 1
        fi
        echo -e "${GREEN}开始翻译文件 $2 到繁体中文...${NC}"
        run_python --file "$2"
        ;;
    zh-tw|zh-TW)
        if [ -n "$2" ]; then
            echo -e "${GREEN}开始翻译文件 $2 到繁体中文...${NC}"
            run_python --file "$2"
        else
            echo -e "${GREEN}开始翻译所有文件到繁体中文...${NC}"
            run_python
        fi
        ;;
    test)
        echo -e "${YELLOW}测试模式 (不调用 API)...${NC}"
        run_python --dry-run
        ;;
    check)
        check_config
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac
