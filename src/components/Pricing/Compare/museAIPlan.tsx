
import { useTranslation } from 'react-i18next'
import { EPlanProductType } from '../types/plan'
import './pricing.css'

export const usePlanMuseAI = () => {
  const { t } = useTranslation('pricing')

  const planMuseAI = [
    {
      group: t("pricing.use"),
      items: [
        {
          key: 'points',
          label: t("plan.details.points"),
          hintText: t('plan.details.points.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/O72QwTXXOiMoAlk1EgZcEc7bnkg",
          plans: {
            [EPlanProductType.PERSON_PRO]: t("pricing.points.perMonth", { val: 800 }),
            [EPlanProductType.TEAM_BASIC]: t("pricing.points.perMonth", { val: '4,000' }),
            [EPlanProductType.TEAM_PRO]: t("pricing.points.perMonth", { val: '8,000' }),
            [EPlanProductType.TEAM_FLAGSHIP]: t("pricing.points.perMonth", { val: '24,000' }),
            [EPlanProductType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
        {
          key: 'storage',
          label: t('plan.details.storage'),
          hintText: t('pricing.storage.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: '1T (1024G)',
            [EPlanProductType.TEAM_BASIC]: '100G',
            [EPlanProductType.TEAM_PRO]: '1T (1024G)',
            [EPlanProductType.TEAM_FLAGSHIP]: '3T (3072G)',
            [EPlanProductType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
        {
          key: 'seatCount',
          label: t('plan.details.seats'),
          hintText: t('pricing.seats.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: t("pricing.1.person.no.expansion.allowed"),
            [EPlanProductType.TEAM_BASIC]: t("plan.detail.seats.team", { val: 5 }),
            [EPlanProductType.TEAM_PRO]: t("plan.detail.seats.team", { val: 10 }),
            [EPlanProductType.TEAM_FLAGSHIP]: t("plan.detail.seats.team", { val: 30 }),
            [EPlanProductType.ENTERPRISE]: t('pricing.configure.on.demand'),
          },
        },
      ],
    },
    {
      group: t('pricing.ai.drawing'),
      items: [
        {
          key: 'community',
          label: t('pricing.inspiration.gallery'),
          hintText: t('pricing.community.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/UuPPwd1JPiBQG5kzf0ZclgAknqg",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'models',
          label: t('pricing.style.model'),
          hintText: t('pricing.models.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'batch-draw',
          label: t('pricing.batch.smart.drawing'),
          hintText: t('pricing.batchDraw.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/BQ1JwvbS1ihIdvknp8Sc6pWXnLf",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'midjounery',
          label: t('pricing.realistic.drawing'),
          hintText: t('pricing.mj.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'nijijounery',
          label: t('pricing.2d.drawing'),
          hintText: t('pricing.niji.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'muse-draw',
          label: 'Muse Draw',
          hintText: t('pricing.museDraw.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'diffusion',
          label: t('pricing.diffusion'),
          hintText: t('pricing.diffusion.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'scribble',
          label: t('pricing.whiteboard.doodle'),
          hintText: t('pricing.scribble.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/Ya56wvSvRimO87kzSgfcopFxnDc",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'controlNet',
          label: t('pricing.image.control'),
          hintText: t('pricing.controlNet.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/K9Hawz5a7iXGtykf8JfcEUIentg",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.ai.video'),
      items: [
        {
          key: 'video-generation',
          label: t('pricing.video.generation'),
          hintText: t('pricing.video.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'music-generation',
          label: t('pricing.music.generation'),
          hintText: t('pricing.music.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.ai.tools'),
      items: [
        {
          key: 'batchImageToPrompt',
          label: t('pricing.convert.batch.images'),
          hintText: t('pricing.batch.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'imageToPrompt',
          label: t('pricing.image.to.prompt'),
          hintText: t('pricing.imageToPrompt.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'imageTagging',
          label: t('pricing.intelligent.image.marking'),
          hintText: t('pricing.imageTagging.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'remove-bg',
          label: t('pricing.smart.cutout'),
          hintText: t('pricing.removeBg.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'rraser',
          label: t('pricing.smart.elimination'),
          hintText: t('pricing.smart.elimination.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'superResolution',
          label: t('pricing.image.superresolution'),
          hintText: t('pricing.image.superresolution.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'colorLip',
          label: t('pricing.image.colorization'),
          hintText: t('pricing.image.colorization.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'repairFace',
          label: t('pricing.photo.repair'),
          hintText: t('pricing.photo.repair.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'inpainting',
          label: t('pricing.image.partial.redraw'),
          hintText: t('pricing.image.partial.redraw.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'qrCode-generation',
          label: t('pricing.qr.code.generation'),
          hintText: t('pricing.qr.code.generation.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'lipstick',
          label: t('pricing.lipstick.color.test'),
          hintText: t('pricing.lipstick.color.test.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/LQgOwC1fCiiIYFkTVHac3fbqnYb",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: 'vectorization',
          label: t('pricing.image.vectorization'),
          hintText: t('pricing.image.vectorization.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.ai.features'),
      items: [
        {
          key: t('pricing.smart.copywriting'),
          label: t('pricing.smart.copywriting'),
          hintText: t('pricing.smart.copywriting.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.model.training'),
          label: t('pricing.model.training'),
          hintText: t('pricing.model.training.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/PdFxwIP1IiBw2LkcqWgcTlI1nOf",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.dataset'),
          label: t('pricing.dataset'),
          hintText: t('pricing.dataset.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/PdFxwIP1IiBw2LkcqWgcTlI1nOf",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.model.management'),
          label: t('pricing.model.management'),
          hintText: t('pricing.model.management.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.dam.library'),
      items: [
        {
          key: t('pricing.mobile.phone.collection'),
          label: t('pricing.mobile.phone.collection'),
          hintText: t('pricing.mobile.phone.collection.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/UcshwhqJAibub0kzljicyIWbn7d",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.browser.batch.collection'),
          label: t('pricing.browser.batch.collection'),
          hintText: t('pricing.browser.batch.collection.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/wikcnAlxBEhe4KNaEpijwk8lhAh",

          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.midjourney.work.transfer'),
          label: t('pricing.midjourney.work.transfer'),
          hintText: t('pricing.midjourney.work.transfer.hint'),
          hintLink: "https://tezign.feishu.cn/wiki/HjJBwGERoiSv67kZYyFcfpd9n5b",
          plans: {
            [EPlanProductType.PERSON_PRO]: true,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        // // 百度网盘同步
        // {
        //   key: t('pricing.baidu.network.disk'),
        //   label: t('pricing.baidu.network.disk'),
        //   hintText: t('pricing.baidu.network.disk.hint'),

        //   plans: {
        //     [EPlanProductType.PERSON_PRO]: false,
        //     [EPlanProductType.TEAM_BASIC]: t('pricing.coming.soon'),
        //     [EPlanProductType.TEAM_PRO]: t('pricing.coming.soon'),
        //     [EPlanProductType.TEAM_FLAGSHIP]: t('pricing.coming.soon'),
        //     [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
        //   },
        // },
        // // 文件作业收集
        // {
        //   key: t('pricing.filejob.collection.function'),
        //   label: t('pricing.filejob.collection.function'),
        //   hintText: t('pricing.filejob.collection.function.hint'),

        //   plans: {
        //     [EPlanProductType.PERSON_PRO]: false,
        //     [EPlanProductType.TEAM_BASIC]: t('pricing.coming.soon'),
        //     [EPlanProductType.TEAM_PRO]: t('pricing.coming.soon'),
        //     [EPlanProductType.TEAM_FLAGSHIP]: t('pricing.coming.soon'),
        //     [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
        //   },
        // },
      ],
    },
    {
      group: t('pricing.ai.collaboration'),
      items: [
        {
          key: t('pricing.team.generation.works'),
          label: t('pricing.team.generation.works'),
          hintText: t('pricing.team.generation.works.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: t('pricing.coming.soon'),
            [EPlanProductType.TEAM_PRO]: t('pricing.coming.soon'),
            [EPlanProductType.TEAM_FLAGSHIP]: t('pricing.coming.soon'),
            [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
          },
        },
        {
          key: t('pricing.team.exclusive.gallery'),
          label: t('pricing.team.exclusive.gallery'),
          hintText: t('pricing.team.exclusive.gallery.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.batch.transfer.of'),
          label: t('pricing.batch.transfer.of'),
          hintText: t('pricing.batch.transfer.of.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.library.collaboration'),
      items: [
        {
          key: t('pricing.team.material.library'),
          label: t('pricing.team.material.library'),
          hintText: t('pricing.team.material.library.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.team.folder.member'),
          label: t('pricing.team.folder.member'),
          hintText: t('pricing.team.folder.member.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.team.folder.department'),
          label: t('pricing.team.folder.department'),
          hintText: t('pricing.team.folder.department.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        // 成员存储空间上限管理
        // {
        //   key: t('pricing.member.storage.space'),
        //   label: t('pricing.member.storage.space'),
        //   hintText: t('pricing.member.storage.space.hint'),

        //   plans: {
        //     [EPlanProductType.PERSON_PRO]: false,
        //     [EPlanProductType.TEAM_BASIC]: false,
        //     [EPlanProductType.TEAM_PRO]: false,
        //     [EPlanProductType.TEAM_FLAGSHIP]: false,
        //     [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
        //   },
        // },
        {
          key: t('pricing.transfer.asset.owners'),
          label: t('pricing.transfer.asset.owners'),
          hintText: t('pricing.transfer.asset.owners.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
      ],
    },
    {
      group: t('pricing.team.management'),
      items: [
        {
          key: t('pricing.custom.corporate.identity'),
          label: t('pricing.custom.corporate.identity'),
          hintText: t('pricing.custom.corporate.identity.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.turn.member.invitations'),
          label: t('pricing.turn.member.invitations'),
          hintText: t('pricing.turn.member.invitations.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.set.member.invitation'),
          label: t('pricing.set.member.invitation'),
          hintText: t('pricing.set.member.invitation.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.team.member.management'),
          label: t('pricing.team.member.management'),
          hintText: t('pricing.team.member.management.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: true,
            [EPlanProductType.TEAM_PRO]: true,
            [EPlanProductType.TEAM_FLAGSHIP]: true,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.invite.specific.members'),
          label: t('pricing.invite.specific.members'),
          hintText: t('pricing.invite.specific.members.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.team.department.management'),
          label: t('pricing.team.department.management'),
          hintText: t('pricing.team.department.management.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.import.members.and'),
          label: t('pricing.import.members.and'),
          hintText: t('pricing.import.members.and.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        //绑定自定义域名
        // {
        //   key: t('pricing.bind.custom.domain'),
        //   label: t('pricing.bind.custom.domain'),
        //   hintText:t('pricing.bind.custom.domain.hint'),

        //   plans: {
        //     [EPlanProductType.PERSON_PRO]: false,
        //     [EPlanProductType.TEAM_BASIC]: false,
        //     [EPlanProductType.TEAM_PRO]: false,
        //     [EPlanProductType.TEAM_FLAGSHIP]: false,
        //     [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
        //   },
        // },
        {
          key: t('pricing.sso.login.feishu'),
          label: t('pricing.sso.login.feishu'),
          hintText: t('pricing.sso.login.feishu.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        //自定义登录注册页
        // {
        //   key: t('pricing.customized.login.registration'),
        //   label: t('pricing.customized.login.registration'),
        //   hintText:t('pricing.customized.login.registration.hint'),

        //   plans: {
        //     [EPlanProductType.PERSON_PRO]: false,
        //     [EPlanProductType.TEAM_BASIC]: false,
        //     [EPlanProductType.TEAM_PRO]: false,
        //     [EPlanProductType.TEAM_FLAGSHIP]: false,
        //     [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
        //   },
        // },
        {
          key: t('pricing.turn.on.or'),
          label: t('pricing.turn.on.or'),
          hintText: t('pricing.turn.on.or.hint'),

          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: true,
          },
        },
        {
          key: t('pricing.whole.site.watermark'),
          label: t('pricing.whole.site.watermark'),
          hintText: t('pricing.whole.site.watermark.hint'),
          plans: {
            [EPlanProductType.PERSON_PRO]: false,
            [EPlanProductType.TEAM_BASIC]: false,
            [EPlanProductType.TEAM_PRO]: false,
            [EPlanProductType.TEAM_FLAGSHIP]: false,
            [EPlanProductType.ENTERPRISE]: t('pricing.coming.soon'),
          },
        },
      ],
    },
  ]
  return { planMuseAI }
}
