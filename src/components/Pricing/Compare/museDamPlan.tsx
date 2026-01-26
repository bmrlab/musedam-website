import { useCountry } from '@/providers/Country'
import { useTranslation } from 'react-i18next'
import { ESpaceType, PlanDetailInfo } from '../types/plan'
import './pricing.css'

export const usePlanMuseDAM = () => {
  const { t } = useTranslation('pricing')
  const { isInChina } = useCountry()
  const AIPlans = [{
    key: 'smart_drawing',
    label: t('pricing.smart_drawing.label'),
    hintText: t('pricing.smart_drawing.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'video_generation',
    label: t('pricing.video_generation.label'),
    hintText: t('pricing.video_generation.hint'),
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'image_to_prompt_word',
    label: t('pricing.image_to_prompt_word.label'),
    hintText: t('pricing.image_to_prompt_word.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'intelligent_image_expansion',
    label: t('pricing.intelligent_image_expansion.label'),
    hintText: t('pricing.intelligent_image_expansion.hint'),
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'smart_elimination',
    label: t('pricing.smart_elimination.label'),
    hintText: t('pricing.smart_elimination.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'image_super_resolution',
    label: t('pricing.image_super_resolution.label'),
    hintText: t('pricing.image_super_resolution.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'photo_repair',
    label: t('pricing.photo_repair.label'),
    hintText: t('pricing.photo_repair.hint'),
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'image_partial_redraw',
    label: t('pricing.image_partial_redraw.label'),
    hintText: t('pricing.image_partial_redraw.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'qr_code_generation',
    label: t('pricing.qr_code_generation.label'),
    hintText: t('pricing.qr_code_generation.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'image_vectorization',
    label: t('pricing.image_vectorization.label'),
    hintText: t('pricing.image_vectorization.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'image_control',
    label: t('pricing.image_control.label'),
    hintText: t('pricing.image_control.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/K9Hawz5a7iXGtykf8JfcEUIentg",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'smart_copywriting',
    label: t('pricing.smart_copywriting.label'),
    hintText: t('pricing.smart_copywriting.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  },
  {
    key: 'dataset_model_training',
    label: t('pricing.dataset_model_training.label'),
    hintText: t('pricing.dataset_model_training.hint'),
    hintLink: "https://tezign.feishu.cn/wiki/PdFxwIP1IiBw2LkcqWgcTlI1nOf",
    plans: {
      [ESpaceType.PERSON_FREE]: true,
      [ESpaceType.PERSON_PRO]: true,
      [ESpaceType.TEAM]: true,
      [ESpaceType.ENTERPRISE]: true,
    },
  }]


  const planMuseDAM: PlanDetailInfo[] = [
    {
      group: t('pricing.use'),
      items: [
        {
          key: 'storage',
          label: t('pricing.planMuseDAM.storage'),
          hintText: t(isInChina ? 'pricing.planMuseDAM.storage.hint.zh' : 'pricing.planMuseDAM.storage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: "5G",
            [ESpaceType.PERSON_PRO]: t('pricing.summary.storage.personal.start', { val: '100G' }),
            [ESpaceType.TEAM]: t('pricing.capacity.expansion.on.demand'),
            [ESpaceType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
        {
          key: 'seatCount',
          label: t("plan.details.seats"),
          hintText: t('pricing.planMuseDAM.seatCount.hint1'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.1.person.no.expansion.allowed'),
            [ESpaceType.PERSON_PRO]: t('pricing.1.person.no.expansion.allowed'),
            [ESpaceType.TEAM]: t('pricing.expand.seats.on.demand'),
            [ESpaceType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
        // ...(isInChina ? [] : [{
        //   key: 'points',
        //   label: t('pricing.planMuseDAM.points'),
        //   hintText: t('pricing.planMuseDAM.points.hint1'),
        //   hintLinkCustom: {
        //     type: "common",
        //     text: t('pricing.planMuseDAM.points.hint2'),
        //     link: "https://tezign.feishu.cn/wiki/AuxBwTKztiQgsDkCdkkcvMqmnDc"
        //   },
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: t('pricing.points.one.time', { val: 100 }),
        //     [ESpaceType.PERSON_PRO]: t("pricing.points.perMonth", { val: 200 }),
        //     [ESpaceType.TEAM]: t("pricing.points.perMonth", { val: '4,000' }),
        //     [ESpaceType.ENTERPRISE]: t('pricing.configure.on.demand'),
        //   },
        // }] as const),
      ],
    },
    {
      group: t('pricing.teamwork'),
      items: [
        {
          key: 'team_shared_space',
          label: t('pricing.team_shared_space.label'),
          hintText: t('pricing.team_shared_space.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'storage',
          label: t('pricing.storage.label'),
          hintText: t('pricing.storage.hint1'),
          hintLinkCustom: {
            type: "common",
            text: t('pricing.operation.log'),
            link: "https://tezign.feishu.cn/wiki/XjKOwnRFaixqyrk9d0CcYq4hnVf"
          },
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'assets-statistics',
          label: t('pricing.assets-statistics.label'),
          hintText: t('pricing.assets-statistics.hint'),
          hintLinkCustom: {
            type: "common",
            text: t('pricing.members_statistics.label'),
            link: "https://tezign.feishu.cn/wiki/XjKOwnRFaixqyrk9d0CcYq4hnVf"
          },
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'members_statistics',
          label: t('pricing.members_statistics.label'),
          hintText: t('pricing.members_statistics.hint'),
          hintLinkCustom: {
            type: "common",
            text: t('pricing.assets_users_logs.label'),
            link: "https://tezign.feishu.cn/wiki/XjKOwnRFaixqyrk9d0CcYq4hnVf"
          },
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // 素材、用户关联活跃统计
        // {
        //   key: 'assets_users_logs',
        //   label: t('pricing.assets_users_logs.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.assets_users_logs.hint')}
        //       <a
        //         className="underline underline-offset-4"
        //         target="_blank"
        //         href="https://tezign.feishu.cn/wiki/R4oow5jXLitA9HkTippcrESunse"
        //       >
        //         {t('pricing.button.detail')}
        //       </a>
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]: false,
        //     [ESpaceType.TEAM]: true,
        //     [ESpaceType.ENTERPRISE]: true,
        //   },
        // },
        {
          key: 'SSO-login',
          label: t('pricing.SSO-login.label'),
          hintText: t('pricing.SSO-login.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.ai.capabilities'),
      items: [
        // 点数相关 - 暂时隐藏
        // {
        //   key: 'points_validity',
        //   label: t('pricing.points.validity'),
        //   hintText: t('pricing.points.validity.hint'),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: t('pricing.summary.points.onetime', { val: 100 }),
        //     [ESpaceType.PERSON_PRO]: t('pricing.monthly.issuance.and.reset'),
        //     [ESpaceType.TEAM]: t('pricing.monthly.issuance.and.reset'),
        //     [ESpaceType.ENTERPRISE]: t('pricing.monthly.issuance.and.reset'),
        //   },
        // },
        {
          key: 'ai_search',
          label: t('pricing.ai_search.label'),
          hintText: t('pricing.ai_search.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },

        {
          key: 'ai_smart_rename',
          label: t('pricing.ai_smart_rename.label'),
          hintText: t('pricing.ai_smart_rename.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'ai_auto_smart_parsing',
          label: t('pricing.ai_auto_smart_parsing.label'),
          hintText: t('pricing.ai_auto_smart_parsing.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'ai_custom_smart_parsing',
          label: t('pricing.ai_custom_smart_parsing.label'),
          hintText: t('pricing.ai_custom_smart_parsing.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'ai_auto_smart_tagging',
          label: t('pricing.ai_auto_smart_tagging.label'),
          hintText: t('pricing.ai_auto_smart_tagging.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'ai_custom_smart_tagging',
          label: t('pricing.ai_custom_smart_tagging.label'),
          hintText: t('pricing.ai_custom_smart_tagging.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },

        {
          key: 'ai_content',
          label: t('pricing.ai_content.label'),
          hintText: t('pricing.ai_content.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // {
        //   key: 'ai_tag',
        //   label: t('pricing.ai_tag.label'),
        //   hintText: t('pricing.ai_tag.hint'),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]: true,
        //     [ESpaceType.TEAM]: true,
        //     [ESpaceType.ENTERPRISE]: true,
        //   },
        // },
        {
          key: 'image_ocr_text_recognition',
          label: t('pricing.image_ocr_text_recognition.label'),
          hintText: t('pricing.image_ocr_text_recognition.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/YwQXwnBwviIpALkmTmqcXu4enBb",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'copilot',
          label: t('pricing.copilot.label'),
          hintText: t('pricing.copilot.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/YwQXwnBwviIpALkmTmqcXu4enBb",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // MuseAI 能力相关
        // ...(isInChina ? AIPlans : [])
      ],
    },
    {
      group: t('pricing.storage.management'),
      items: [
        {
          key: 'bigFileManage',
          label: t('pricing.bigFileManage.label'),
          hintText: t('pricing.bigFileManage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.2g'),
            [ESpaceType.PERSON_PRO]: t('pricing.20g'),
            [ESpaceType.TEAM]: t('pricing.20g'),
            [ESpaceType.ENTERPRISE]: t('pricing.20g'),
          },
        },
        {
          key: 'transfer_quantity',
          label: t('pricing.transfer_quantity.label'),
          hintText: t('pricing.transfer_quantity.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: "500",
            [ESpaceType.PERSON_PRO]: "5,000",
            [ESpaceType.TEAM]: "10,000",
            [ESpaceType.ENTERPRISE]: "10,000",
          },
        },
        {
          key: 'zip_download',
          label: t('pricing.zip_download.label'),
          hintText: t('pricing.zip_download.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.3g'),
            [ESpaceType.PERSON_PRO]: t('pricing.6g'),
            [ESpaceType.TEAM]: t('pricing.6g'),
            [ESpaceType.ENTERPRISE]: t('pricing.6g'),
          },
        },
        {
          key: 'local_app',
          label: t('pricing.local_app.label'),
          hintText: t('pricing.local_app.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'bin_saved_days',
          label: t('pricing.bin_saved_days.label'),
          hintText: t('pricing.bin_saved_days.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.7.days'),
            [ESpaceType.PERSON_PRO]: t('pricing.30.days'),
            [ESpaceType.TEAM]: t('pricing.30.days'),
            [ESpaceType.ENTERPRISE]: t('pricing.60.days'),
          },
        },
        {
          key: 'document_manage',
          label: t('pricing.document_manage.label'),
          hintText: t('pricing.document_manage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'video_manage',
          label: t('pricing.video_manage.label'),
          hintText: t('pricing.video_manage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'batch_upload',
          label: t('pricing.batch_upload.label'),
          hintText: t('pricing.batch_upload.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.no.limit'),
            [ESpaceType.PERSON_PRO]: t('pricing.no.limit'),
            [ESpaceType.TEAM]: t('pricing.no.limit'),
            [ESpaceType.ENTERPRISE]: t('pricing.no.limit'),
          },
        },
        {
          key: 'download_traffic',
          label: t('pricing.download_traffic.label'),
          hintText: t('pricing.download_traffic.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.2t.month.reset.every.month', { val: "50G" }),
            [ESpaceType.PERSON_PRO]: t('pricing.2t.month.reset.every.month', { val: "2T" }),
            [ESpaceType.TEAM]: t('pricing.follow.storage.space'),
            [ESpaceType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
        {
          key: 'fastUpAndDown',
          label: t('pricing.fastUpAndDown.label'),
          hintText: t('pricing.fastUpAndDown.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'zip_manage',
          label: t('pricing.zip_manage.label'),
          hintText: t('pricing.zip_manage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'install_manage',
          label: t('pricing.install_manage.label'),
          hintText: t('pricing.install_manage.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'file_version',
          label: t('pricing.file_version.label'),
          hintText: t('pricing.file_version.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'file_comment',
          label: t('pricing.file_comment.label'),
          hintText: t('pricing.file_comment.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
      ],
    },
    {
      group: t('pricing.share.collaboration'),
      items: [
        {
          key: 'material_sharing',
          label: t('pricing.material_sharing.label'),
          hintText: t('pricing.material_sharing.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'number_of_files_shared_per_time',
          label: t('pricing.number_of_files_shared_per_time.label'),
          hintText: t('pricing.number_of_files_shared_per_time.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: 500,
            [ESpaceType.PERSON_PRO]: t('pricing.no.limit'),
            [ESpaceType.TEAM]: t('pricing.no.limit'),
            [ESpaceType.ENTERPRISE]: t('pricing.no.limit'),
          },
        },
        {
          key: 'share_validity_settings',
          label: t('pricing.share_validity_settings.label'),
          hintText: t('pricing.share_validity_settings.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'share_access_settings',
          label: t('pricing.share_access_settings.label'),
          hintText: t('pricing.share_access_settings.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'encrypted_sharing',
          label: t('pricing.encrypted_sharing.label'),
          hintText: t('pricing.encrypted_sharing.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'whitelist_sharing',
          label: t('pricing.whitelist_sharing.label'),
          hintText: t('pricing.whitelist_sharing.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'sharing_link_management',
          label: t('pricing.sharing_link_management.label'),
          hintText: t('pricing.sharing_link_management.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'share_link_to_access_data_dashboard',
          label: t('pricing.share_link_to_access_data_dashboard.label'),
          hintText: t('pricing.share_link_to_access_data_dashboard.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/SCS0wKi6CiSR3GkE4BecXnaYn8z",
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.online.preview'),
      items: [
        {
          key: 'image',
          label: t('pricing.image.label'),
          hintText: t('pricing.image.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'design',
          label: t('pricing.design.label'),
          hintText: t('pricing.design.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'model',
          label: t('pricing.model.label'),
          hintText: t('pricing.model.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        }, {
          key: 'C4D',
          label: t('pricing.C4D.label'),
          hintText: t('pricing.C4D.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'audio',
          label: t('pricing.audio.label'),
          hintText: t('pricing.audio.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },

          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'font',
          label: t('pricing.font.label'),
          hintText: t('pricing.font.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'web',
          label: t('pricing.web.label'),
          hintText: t('pricing.web.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'video_type',
          label: t('pricing.video_type.label'),
          hintText: t('pricing.video.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'ppt',
          label: t('pricing.ppt.label'),
          hintText: t('pricing.ppt.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'excel',
          label: t('pricing.excel.label'),
          hintText: t('pricing.excel.hint'),
          hintLinkCustom: {
            type: "fileSupport",

          },
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'text',
          label: t('pricing.text.label'),
          hintText: t('pricing.text.hint'),
          hintLinkCustom: {
            type: "fileSupport",
          },
          plans: {
            [ESpaceType.PERSON_FREE]: t('pricing.limited.immunity'),
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'video',
          label: t('pricing.video.label'),
          hintText: t('pricing.video.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.material.resource.collection'),
      items: [
        ...(isInChina ? [{
          key: 'phone_collect',
          label: t('pricing.phone_collect.label'),
          hintText: t('pricing.phone_collect.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/UcshwhqJAibub0kzljicyIWbn7d",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        }] : []),
        {
          key: 'web_batch_collection',
          label: t('pricing.web_batch_collection.label'),
          hintText: t('pricing.web_batch_collection.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/wikcnAlxBEhe4KNaEpijwk8lhAh",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'Midjourney_transfer',
          label: t('pricing.Midjourney_transfer.label'),
          hintText: t('pricing.Midjourney_transfer.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/HjJBwGERoiSv67kZYyFcfpd9n5b",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // {
        //   key: 'baidu_network_disk_synchronization',
        //   label: t('pricing.baidu_network_disk_synchronization.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.baidu_network_disk_synchronization.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]:true,
        //     [ESpaceType.TEAM]:true,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },
        // {
        //   key: 'file_job_collection_function',
        //   label: t('pricing.file_job_collection_function.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.file_job_collection_function.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]:true,
        //     [ESpaceType.TEAM]:true,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },
      ],
    },
    {
      group: t('pricing.online.management'),
      items: [
        {
          key: 'asset_tag',
          label: t('pricing.asset_tag.label'),
          hintText: t('pricing.asset_tag.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LJ1rwhQ1BigRIik7NkxcO4gxnpo",
          plans: {
            [ESpaceType.PERSON_FREE]: 300,
            [ESpaceType.PERSON_PRO]: t('pricing.unlimited.quantity'),
            [ESpaceType.TEAM]: t('pricing.unlimited.quantity'),
            [ESpaceType.ENTERPRISE]: t('pricing.unlimited.quantity'),
          },
        },
        {
          key: 'asset_score',
          label: t('pricing.asset_score.label'),
          hintText: t('pricing.asset_score.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        ...(isInChina ? [{
          key: 'import_eagle',
          label: t('pricing.import_eagle.label'),
          hintText: t('pricing.import_eagle.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/HeF4wmfzhi05cMkzg46c3Hk2nVc",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        }] : []),
        {
          key: 'color_filter',
          label: t('pricing.color_filter.label'),
          hintText: t('pricing.color_filter.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'duplicate_check',
          label: t('pricing.duplicate_check.label'),
          hintText: t('pricing.duplicate_check.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/JZxUwmT2KihsExk4Aq7cz5Xpnee",
          plans: {
            [ESpaceType.PERSON_FREE]: true,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'smart_folder',
          label: t('pricing.smart_folder.label'),
          hintText: t('pricing.smart_folder.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/JHW6wNc46iVWLpkvlWLcHucan0D",
          plans: {
            [ESpaceType.PERSON_FREE]: 5,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: t('pricing.unlimited.quantity'),
          },
        },
        // {
        //   key: 'similar_asset_check',
        //   label: t('pricing.similar_asset_check.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.similar_asset_check.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]:true,
        //     [ESpaceType.TEAM]:true,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },

        {
          key: 'batch_rename',
          label: t('pricing.batch_rename.label'),
          hintText: t('pricing.batch_rename.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'batch_edit',
          label: t('pricing.batch_edit.label'),
          hintText: t('pricing.batch_edit.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: true,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'batch_tag',
          label: t('pricing.batch_tag.label'),
          hintText: t('pricing.batch_tag.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'custom_metadata',
          label: t('pricing.custom_metadata.label'),
          hintText: t('pricing.custom_metadata.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },
        {
          key: 'compliance_check',
          label: t('pricing.compliance_check.label'),
          hintText: t('pricing.compliance_check.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },

      ],
    },
    {
      group: t('pricing.library.collaboration'),
      items: [
        {
          key: 'team_material_library_management',
          label: t('pricing.team_material_library_management.label'),
          hintText: t('pricing.team_material_library_management.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_folder_member_permissions',
          label: t('pricing.team_folder_member_permissions.label'),
          hintText: t('pricing.team_folder_member_permissions.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_folder_department_permissions',
          label: t('pricing.team_folder_department_permissions.label'),
          hintText: t('pricing.team_folder_department_permissions.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_folder_auth',
          label: t('pricing.team_folder_auth.label'),
          hintText: t('pricing.team_folder_auth.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'subfolder_auth',
          label: t('pricing.subfolder_auth.label'),
          hintText: t('pricing.subfolder_auth.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // {
        //   key: 'member_storage_space_upper_limit_management',
        //   label: t('pricing.member_storage_space_upper_limit_management.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.member_storage_space_upper_limit_management.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]: false,
        //     [ESpaceType.TEAM]: false,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },
        {
          key: 'transfer_asset_owners_in_bulk',
          label: t('pricing.transfer_asset_owners_in_bulk.label'),
          hintText: t('pricing.transfer_asset_owners_in_bulk.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'project_management',
          label: t('pricing.project_management.label'),
          hintText: t('pricing.project_management.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'approval_entry',
          label: t('pricing.approval_entry.label'),
          hintText: t('pricing.approval_entry.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },

      ],
    },
    {
      group: t('pricing.team.management'),
      items: [
        {
          key: 'custom_corporate_identity',
          label: t('pricing.custom_corporate_identity.label'),
          hintText: t('pricing.custom_corporate_identity.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'turn_member_invitations_on_or_off',
          label: t('pricing.turn_member_invitations_on_or_off.label'),
          hintText: t('pricing.turn_member_invitations_on_or_off.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'set_member_invitation_validity_period',
          label: t('pricing.set_member_invitation_validity_period.label'),
          hintText: t('pricing.set_member_invitation_validity_period.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_member_management',
          label: t('pricing.team_member_management.label'),
          hintText: t('pricing.team_member_management.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: true,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_home_page',
          label: t('pricing.team_home_page.label'),
          hintText: t('pricing.team_home_page.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
          showSparkles: true
        },

        {
          key: 'invite_specific_members',
          label: t('pricing.invite_specific_members.label'),
          hintText: t('pricing.invite_specific_members.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'team_department_management',
          label: t('pricing.team_department_management.label'),
          hintText: t('pricing.team_department_management.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },


        {
          key: 'team_group_management',
          label: t('pricing.team_group_management.label'),
          hintText: t('pricing.team_group_management.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },



        {
          key: 'team_visitor_and_whitelist',
          label: t('pricing.team_visitor_and_whitelist.label'),
          hintText: t('pricing.team_visitor_and_whitelist.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },

        {
          key: 'import_members_and_departments_in_batches',
          label: t('pricing.import_members_and_departments_in_batches.label'),
          hintText: t('pricing.import_members_and_departments_in_batches.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        // {
        //   key: 'bind_a_custom_domain_name',
        //   label: t('pricing.bind_a_custom_domain_name.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.bind_a_custom_domain_name.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]: false,
        //     [ESpaceType.TEAM]: false,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },

        ...(isInChina ? [{
          key: t('pricing.sso.login.feishu'),
          label: t('pricing.sso.login.feishu'),
          hintText: t('pricing.sso.login.feishu.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        }] : []),
        // {
        //   key: 'customized_login_registration_page',
        //   label: t('pricing.customized_login_registration_page.label'),
        //   hints: (
        //     <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
        //       {t('pricing.customized_login_registration_page.hint')}
        //     </div>
        //   ),
        //   plans: {
        //     [ESpaceType.PERSON_FREE]: false,
        //     [ESpaceType.PERSON_PRO]: false,
        //     [ESpaceType.TEAM]: false,
        //     [ESpaceType.ENTERPRISE]:true,
        //   },
        // },
        {
          key: 'turn_on_or_off_site_wide_file_sharing',
          label: t('pricing.turn_on_or_off_site_wide_file_sharing.label'),
          hintText: t('pricing.turn_on_or_off_site_wide_file_sharing.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
        {
          key: 'whole_site_watermark_function',
          label: t('pricing.whole_site_watermark_function.label'),
          hintText: t('pricing.whole_site_watermark_function.hint'),
          plans: {
            [ESpaceType.PERSON_FREE]: false,
            [ESpaceType.PERSON_PRO]: false,
            [ESpaceType.TEAM]: false,
            [ESpaceType.ENTERPRISE]: true,
          },
        },
      ],
    },
  ]


  return { planMuseDAM }
}
