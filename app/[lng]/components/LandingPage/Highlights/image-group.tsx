import { twx } from '@/lib/utils'
import Image from 'next/image'
import { motion } from 'framer-motion'

const CollectImagePrefix = '/Highlights/Collect'
const OrganizeImagePrefix = '/Highlights/Organize'
const CollaborateImagePrefix = '/Highlights/Collaborate'
const AIGenerateImagePrefix = '/Highlights/AI-Generate'

export const CollectImageGroup = ({
  isBuildFinished,
}: {
  isBuildFinished: (i: number) => boolean
}) => {
  return (
    <RelativeContainer>
      <MotionShadowImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-BG.png`}
        width={540}
        height={368}
        alt="MuseDAM-Collect-BG"
        className="rounded-[9px]"
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      />
      <MotionShadowImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Browser-Plugin.png`}
        width={114}
        height={25}
        alt="MuseDAM-Collect-Browser-Plugin"
        className="absolute left-[-45.37px] top-[51px] rounded-[6.4px]"
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <MotionShadowImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Discord-Bot.png`}
        width={96}
        height={25}
        alt="MuseDAM-Collect-Discord-Bot"
        className="absolute bottom-[123px] left-[-36.37px] rounded-[6.4px]"
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
      />
      <MotionImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Drag-and-Drop.png`}
        width={165.27}
        height={165.27}
        alt="MuseDAM-Collect-Drag-and-Drop"
        className="absolute bottom-[-49.79px] right-[96.13px] rounded-[8px] shadow-[0_2.75px_20.66px_2.75px_#00000014]"
        initial={{ opacity: 0, y: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      />
      <MotionImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Video.png`}
        width={160.51}
        height={121.53}
        alt="MuseDAM-Collect-Video"
        className="absolute bottom-[39.95px] right-[-10.62px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]"
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
      />
      <MotionImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Image.png`}
        width={123.35}
        height={145.54}
        alt="MuseDAM-Collect-Image"
        className="absolute right-[-13.22px] top-[110px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]"
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
      />
    </RelativeContainer>
  )
}

export const OrganizeImageGroup = ({
  isBuildFinished,
}: {
  isBuildFinished: (i: number) => boolean
}) => {
  return (
    <div>
      <MotionShadowImage
        src={`${OrganizeImagePrefix}/MuseDAM-Organize-File-Formats.png`}
        width={541.74}
        height={64.07}
        alt="MuseDAM-Organize-File-Formats"
        initial={{ opacity: 0, y: '-20px' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="rounded-full"
      />
      <RelativeContainer>
        <MotionShadowImage
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-BG.png`}
          width={540}
          height={368}
          alt="MuseDAM-Organize-BG.png"
          className="mt-[28.93px] rounded-[9px]"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        />
        <MotionShadowImage
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-70-File-Formats.png`}
          width={124}
          height={27}
          alt="MuseDAM-Organize-70-File-Formats"
          className="absolute right-[-51px] top-[51px] rounded-[6.4px] shadow-[0_3.42px_25.63px_3.42px_#00000014]"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <MotionImage
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-Find-Similar-Color-Images.png`}
          width={184}
          height={27}
          alt="MuseDAM-Organize-Find-Similar-Color-Images"
          className="absolute right-[-51px] top-[89.73px] rounded-[8px] shadow-[0_2.75px_20.66px_2.75px_#00000014]"
          initial={{ opacity: 0, y: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        />
        <MotionImage
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-Preview.png`}
          width={75.53}
          height={39.47}
          alt="MuseDAM-Organize-Preview"
          className="absolute left-[192px] top-[171px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]"
          initial={{ opacity: 0, y: '-10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        <MotionImage
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-Image-Card.png`}
          width={233.13}
          height={199.72}
          alt="MuseDAM-Organize-Image-Card"
          className="absolute left-[348.87px] top-[182px] z-10 drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
        />
      </RelativeContainer>
    </div>
  )
}

export const CollaborateImageGroup = ({
  isBuildFinished,
}: {
  isBuildFinished: (i: number) => boolean
}) => {
  return (
    <div className="flex flex-col gap-[16.67px]">
      <MotionShadowImage
        src={`${CollaborateImagePrefix}/MuseDAM-Collaborate-Members.png`}
        width={175.28}
        height={52.33}
        alt="MuseDAM-Collaborate-Members"
        className="self-end rounded-[4px]"
        initial={{ opacity: 0, y: '-20px' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
      />
      <RelativeContainer>
        <MotionShadowImage
          src={`${CollaborateImagePrefix}/MuseDAM-Collaborate-BG.png`}
          width={540}
          height={358}
          alt="MuseDAM-Collaborate-BG"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        />
        <MotionImage
          src={`${CollaborateImagePrefix}/MuseDAM-Collaborate-Collaboration.png`}
          width={119}
          height={312}
          alt="MuseDAM-Collaborate-Collaboration"
          className="absolute left-[-41px] top-[75px]"
          initial={{ opacity: 0, x: '-10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        <MotionShadowImage
          src={`${CollaborateImagePrefix}/MuseDAM-Collaborate-Ranking.png`}
          width={184}
          height={27}
          alt="MuseDAM-Collaborate-Ranking"
          className="absolute right-[-40.07px] top-[43.1px] rounded-[10px]"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        <MotionShadowImage
          src={`${CollaborateImagePrefix}/MuseDAM-Collaborate-Share-Card.png`}
          width={282.5}
          height={264.89}
          alt="MuseDAM-Collaborate-Share-Card"
          className="absolute right-[-40.5px] top-[144.65px]"
          initial={{ opacity: 0, y: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </RelativeContainer>
    </div>
  )
}

export const AIGenerateImageGroup = ({
  isBuildFinished,
}: {
  isBuildFinished: (i: number) => boolean
}) => {
  return (
    <RelativeContainer>
      <MotionShadowImage
        src={`${AIGenerateImagePrefix}/MuseDAM-AI-Generate-BG.png`}
        width={540}
        height={368}
        alt="MuseDAM-AI-Generate-BG"
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      />
      <MotionImage
        src={`${AIGenerateImagePrefix}/MuseDAM-AI-Generate-Search.png`}
        width={212.83}
        height={30}
        alt="MuseDAM-AI-Generate-Search"
        className="absolute right-[-49.33px] top-[42px] rounded-[5px] shadow-[0_0_0_2.35px_#3366FF33]"
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
      />
      <MotionShadowImage
        src={`${AIGenerateImagePrefix}/MuseDAM-AI-Generate-AI-Parsing.png`}
        width={224.94}
        height={171.41}
        alt="MuseDAM-AI-Generate-AI-Parsing"
        className="absolute bottom-[-79.41px] left-[94px] rounded-[8px]"
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
      />
      <MotionShadowImage
        src={`${AIGenerateImagePrefix}/MuseDAM-AI-Generate-Copilot.png`}
        width={199.2}
        height={321.21}
        alt="MuseDAM-AI-Generate-Copilot"
        className="absolute right-[-48.2px] top-[105.26px]"
        initial={{ opacity: 0, y: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
      />
    </RelativeContainer>
  )
}

const MotionImage = motion.create(Image)

const RelativeContainer = twx.div`relative`

const ShadowImage = twx(Image)`shadow-[0_4px_30px_4px_#00000014]`
const MotionShadowImage = motion.create(ShadowImage)
