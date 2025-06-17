
import { useTranslation } from 'react-i18next';

export const useEnterprisePlan = () => {
    const { t } = useTranslation('pricing');

    // Basic
    const basicList = {
        "01 AI Capabilities": [
            { name: "AI Auto Parsing", detail: "Automatically analyzes uploaded assets to extract content descriptions, color schemes, mood attributes, and metadata for enhanced discoverability." },
            { name: "AI Auto Tagging", detail: "Intelligently applies relevant tags to assets based on advanced content analysis during the upload process." },
            { name: "AI Smart Renaming", detail: "Automatically generates meaningful file names based on content analysis, optimizing filenames." },
            { name: "Smart Search", detail: "AI powered content search utilizing precise and semantic search for superior asset discovery." },
            { name: "Search Similar Images", detail: "Upload local images to find visually similar assets in your library, or search for comparable content across your entire system." }
        ],
        "02 Storage Management": [
            { name: "Unrestricted Search Upload", detail: "No restrictions on simultaneous file uploads, supporting extensive content migration workflows." },
            { name: "Large File Support", detail: "Handle files up to 200GB in size, perfect for high-resolution images, videos, or project files." },
            { name: "Download Quota", detail: "Flexible download limits aligned with storage allocation and billing periods." }
        ],
        "03 Asset Organization": [
            { name: "70+ Format Online Preview", detail: "Comprehensive format support with instant preview capabilities including: jpg, jpeg, png, gif, svg, webp, psd, ai, eps, pdf, tiff, bmp, exr, heic, heif, raw, mp4, mov, avi, wmv, flv, m4v, mkv, mp3, wav, aac, ogg, wma, flac, zip, rar, 7z, tar, gz, csv, xls, xlsx, doc, docx, ppt, pptx, txt, md, json, xml, html, css, js, ts, jsx, tsx, c4d, obj, fbx, glb, usdz, stl, 3ds, dae, blend, skp, step, iges, dwg, dxf, ifc, rvt, rfa, and more." },
            { name: "Flexible Tagging System", detail: "Individual and batch tagging with hierarchical two-level tag structure for structured asset management." },
            { name: "Asset Rating System", detail: "5-star rating system for asset quality assessment." },
            { name: "Color-based Filtering", detail: "Advanced color matching and filtering capabilities across your entire asset library." },
            { name: "Duplicate Detection", detail: "Automatic identification of duplicate files during upload process to prevent redundancy." },
            { name: "Bulk Rename", detail: "Built-in rename utility supporting series, numbers, tags, original filenames, and pattern rules." },
            { name: "Bulk Operations", detail: "Comprehensive batch editing capabilities for metadata including names, notes, links, tags, and ratings." },
            { name: "Folder Access", detail: "Flexible local permission management at the primary folder level." }
        ],
        "04 Sharing & Collaboration": [
            { name: "Role-Based Sharing", detail: "Share individual assets or complete folders with customizable permission settings." },
            { name: "Time-limited Access Control", detail: "Configure sharing link expiration periods, IP address restrictions, and additional filters." },
            { name: "Permission Management", detail: "Set download, invisible, or view-only access rights for shared content." },
            { name: "Secure Sharing", detail: "Share content through secure links with custom access codes and enhanced security." },
            { name: "Comprehensive Sharing Statistics", detail: "Detailed management interface for all sharing activities and permissions." }
        ],
        "05 Analytics & Monitoring": [
            { name: "Analytics Logging", detail: "Detailed asset operation logs including uploads, downloads, sharing, and modifications." },
            { name: "Asset Performance Analytics", detail: "Interactive dashboards for performance tracking: views, downloads, and sharing statistics with user attribution." },
            { name: "User Behavior Analysis", detail: "Detailed analysis on individual user actions and engagement patterns." }
        ],
        "06 Extensions": [
            { name: "Web Browser Extensions", detail: "Drag-and-drop or batch collection/selection of images, videos, and web content with one-click saving functionality." },
            { name: "Social Media Integration", detail: "Direct content collection from popular platforms: Kuaishou, Douyin, Weibo, WeChat official accounts, and other social networks." },
            { name: "Desktop App", detail: "MuseDAM Desktop Application for seamless file transfer/management with advanced features including batch operations, large file transfers, resource capacity, and batch resource controls." }
        ]
    };

    // Advanced
    const advancedList = {
        "01 Advanced Features": [
            { name: "AskMuse AI", detail: "Interactive AI engine for Q&A and content-related task generation based on your asset content." },
            { name: "Custom Usage", detail: "Complete asset versioning system with metadata tracking and rollback capabilities." },
            { name: "Collaborative Annotations", detail: "Enable team members to add comments, annotations, and feedback directly on assets for collaborative review." },
            { name: "Multi-Level Permissions", detail: "Granular access control with edit/view permissions at folder and subfolder levels." },
            { name: "Department Management", detail: "Organization-wide hierarchical and controlled sharing with specified user-only." },
            { name: "Enterprise Security", detail: "Multi-factor authentication and controlled sharing with specified users only." },
            { name: "System Wide Controls", detail: "Audit-level logging and asset ownership between users." },
            { name: "Ownership Management", detail: "Bulk transfer of asset ownership between users." }
        ],
        "02 Custom System Homepage": [
            { name: "Theme Configuration", detail: "Light/dark color scheme options for instant interface customization." },
            { name: "Personalized Configuration", detail: "Configure custom enterprise panel homepage with personalized modules." },
            { name: "Navigation Layout", detail: "Customizable navigation layouts, workspace, search bars, and interface elements." },
            { name: "Visible Links", detail: "Customizable quick links for frequently used resources." },
            { name: "Recommended Sections", detail: "Choose 4-8 customizable sections with images, titles, and direct links for each section." },
            { name: "Banner Display", detail: "Full screen or half-screen layout options with uploaded or editable background images." }
        ],
        "03 Approval Workflow": [
            { name: "Configurable Approval", detail: "Flexible workflow configuration to match organizational requirements and compliance needs." },
            { name: "Process Flow", detail: "Visual drag-and-drop interface for approval flow management." },
            { name: "Approver Designation", detail: "Assign specific approvers for different workflow stages and content types." },
            { name: "Approval Center", detail: "Centralized dashboard for all approval requests, notifications, and overall check-in requests." }
        ],
        "04 Compliance Check": [
            { name: "Content Safety Detection", detail: "Automated AI-powered screening for inappropriate or explicit content matched against compliance policies." },
            { name: "Violence and Sensitive Detection", detail: "Advanced identification of violent and potentially sensitive content." },
            { name: "Custom Filtering Rules", detail: "Configurable blacklist and whitelist for organization-specific content policies." }
        ],
        "05 Custom Metadata Fields": [
            { name: "Custom Field Configuration", detail: "Configure personalized field types and content within the asset library." },
            { name: "Multiple Field Types", detail: "Support for text, single-select, multi-select, person, date, number, hyperlink, and additional field formats." },
            { name: "Field Capacity", detail: "Maximum of 350 custom fields per asset to accommodate complex organizational needs." }
        ],
        "06 Watermark": [
            { name: "Site-wide Watermark", detail: "Comprehensive watermark coverage across the entire platform with single or dual toggle control." },
            { name: "Custom Watermark", detail: "Personalized watermark text and design options." },
            { name: "Universal Obfuscation", detail: "Watermark appears consistently on all screens and interfaces when activated." }
        ],
        "07 Enterprise Single Sign-On (SSO)": [
            { name: "Feishu SSO", detail: "Single sign-on integration with Feishu enterprise platform." },
            { name: "WeChat Work SSO", detail: "Single sign-on integration with WeChat Work." },
            { name: "DingTalk SSO", detail: "Single sign-on integration and authentication via DingTalk." }
        ],
        "08 Customer Service": [
            { name: "Ticketing Support", detail: "Dedicated ticketing system with guaranteed 1-2 business day response time." }
        ],
        "09 Professional Services & Support": [
            { name: "Roadmap Feature Development", detail: "Product feature iterations based on development roadmap and customer feedback." },
            { name: "Consultation & Training", detail: "2 dedicated consultation sessions and enterprise training programs per year." },
            { name: "Dedicated Customer Support", detail: "24/7 live chat and customer support coverage with dedicated success team." }
        ]
    };

    // Value-Added Services
    const addedList = {
        "01 Capacity Expansion": [
            { name: "Seat Expansion", detail: "Additional seats configurable as administrators, contributors or member roles." },
            { name: "Storage Expansion", detail: "Additional TB file storage expansion." },
            { name: "AI Points Expansion", detail: "Additional 20,000+ file service expansion. AI points (initial amount) can be used for custom AI tagging, intelligent parsing, and content generation." },
            { name: "Download Data Expansion", detail: "Additional TB download traffic package per increment (billed until consumed)." }
        ],
        "02 Professional Services & Support": [
            { name: "Professional Services", detail: "Custom professional services and support packages for enterprise build and customization." }
        ]
    };

    const allFeature = {
        basic: {
            title: t('Basic'),
            list: basicList
        },
        advanced: {
            title: t('Advanced'),
            list: advancedList
        },
        added: {
            title: t('Value-Added Services'),
            list: addedList
        }
    };

    return { allFeature };
};    