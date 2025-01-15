'use client'

import Image from 'next/image'
import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { cn } from '@/utilities/cn'
import { FlexCenterContainer } from '../../StyleWrapper/Container'
import * as Accordion from '@radix-ui/react-accordion';
import { InfoTooltip, TableCell } from '../TableComponents'
import { usePlanMuseAI } from './museAIPlan'
import { EPlanProductType } from '../types/plan'


const QAAccordion = () => {
  const { t } = useTranslation('pricing')
  const items: { answerLen: number, otherAnswer?: any }[] = [
    {
      answerLen: 3
    },
    {
      answerLen: 1,
    },
    {
      answerLen: 3,
    }
  ];
  return (
    <Accordion.Root
      type="multiple"
      className='px-5 md:px-10'
    >
      {items.map(({ answerLen, otherAnswer }, i) => {
        return <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="border-card-border mb-6 rounded-[16px] border p-6"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger
              className={cn(
                "flex w-full items-center justify-between",
                "group "
              )}
            >
              <h3 className="text-start text-[18px] font-medium leading-5">{t(`pricing.questions.ai.ask${i}`)}</h3>
              <ChevronDownIcon
                className="ease-[cubic-bezier(0.87,0,0.13,1)] shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              "data-[state=open]:animate-slideDown",
              "data-[state=closed]:animate-slideUp",
              "mt-3 overflow-hidden",
            )}
          >
            {Array.from({ length: answerLen }).map((_, answerIndex) => {
              return <p className="mb-0 font-mono text-sm leading-5 text-[#676C77]" key={`answer-${i}-${answerIndex}`}>
                {t(`pricing.questions.ai.answer${i + '_' + answerIndex}`)}
              </p>
            })}
            {otherAnswer}
          </Accordion.Content>
        </Accordion.Item>
      })}
    </Accordion.Root>
  );
};
export default function DetailTableOfMuseAI() {
  const { t } = useTranslation('pricing')
  const { planMuseAI } = usePlanMuseAI()
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    const checkIfNeedsScroll = () => {
      if (container && header) {
        const needsScroll = container.scrollWidth > container.clientWidth;
        console.log("needsScroll", needsScroll)
        container.style.overflowX = needsScroll ? 'auto' : ''
        header.style.top = needsScroll ? '0' : '70px';
      }
    };

    // 初始检查
    checkIfNeedsScroll();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIfNeedsScroll);

    // 清理监听器
    return () => {
      window.removeEventListener('resize', checkIfNeedsScroll);
    };
  }, []);

  const columns = [
    {
      key: EPlanProductType.PERSON_PRO,
      titleKey: 'pricing.pro',
      desKey: 'pricing.pro.des'
    }, {
      key: EPlanProductType.TEAM_BASIC,
      titleKey: "pricing.team.basic",
      desKey: "pricing.team.basic.des"
    }, {
      key: EPlanProductType.TEAM_PRO,
      titleKey: "pricing.team.pro",
      desKey: "pricing.team.pro.des",
      isHighlight: true
    }, {
      key: EPlanProductType.TEAM_FLAGSHIP,
      titleKey: "pricing.team.flagship",
      desKey: "pricing.team.flagship.des"
    }, {
      key: EPlanProductType.ENTERPRISE,
      titleKey: "pricing.team.enterprise",
      desKey: 'pricing.team.enterprise.des.museAI',
      icon: '/assets/Pricing/vip.svg'
    }

  ]
  return (
    <div className="text-default mt-[60px] w-full" >
      <h1 className="mb-[40px] text-center font-euclid text-[32px] leading-[45px]">{t('pricing.rights')}</h1>
      <div className="pricing-content no-scrollbar mb-[60px] w-full px-5 md:px-10" ref={containerRef}>
        <table className="pricing-table w-full min-w-[915px] table-fixed text-center text-sm leading-5">
          <thead className="sticky top-[70px] z-[11]" ref={headerRef}>
            <tr>
              <th scope="col" className="text-description w-[170px] rounded-tl-[16px] text-sm leading-5 md:w-[228px]">
                {t('pricing.services')}
              </th>

              {columns.map((item, i) => {
                const { key, titleKey, desKey, icon, isHighlight } = item
                const isLast = i === columns.length - 1
                return <th scope="col" className={cn("relative w-[140px] md:w-auto",
                  isHighlight && "after:absolute after:-inset-x-px after:bottom-0 after:block after:h-[3px] after:content-['']",
                  isHighlight && 'after:bg-gradient-to-l after:from-[#7E6CE8] after:to-[#CF6CE8]',
                  isLast && 'rounded-tr-[16px]'
                )} key={`header-${key}`}>
                  <div className="flex flex-col items-center justify-center gap-[10px]">
                    <FlexCenterContainer className="gap-1 text-base font-medium leading-6 xl:text-[16px] 2xl:text-[20px]">
                      {t(titleKey)}
                      {icon && <Image
                        src={icon}
                        className="inline size-[19px]"
                        alt=""
                        width={20}
                        height={20}
                      />}
                    </FlexCenterContainer>
                    <span className="rounded bg-[#F6F7F9] px-2 font-mono text-[10px] font-normal leading-[16px] text-[#676C77]">
                      {t(desKey)}
                    </span>
                  </div>
                </th>
              })}
            </tr>
          </thead>
          <tbody>
            {planMuseAI.map((group, index) => (
              <Fragment key={group.group}>
                {index < planMuseAI.length && (
                  <tr className="row--blank">
                    <td colSpan={6}></td>
                  </tr>
                )}
                <tr className="row--group" id={`planMuseAI-group-${index}`}>
                  <td colSpan={6}>{group.group}</td>
                </tr>
                {group.items?.map((row, rowIndex) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'row row--group__item',
                      rowIndex === group.items.length - 1 ? 'row--group__item--last' : '',
                      rowIndex % 2 === 0 ? '' : 'row--light',
                      rowIndex === group.items.length - 1
                        ? 'border border-t-0 border-[#EBECEE]'
                        : 'border-x border-[#EBECEE]',
                    )}
                  >

                    <td className="cell text-[#676C77]">
                      <div className="flex items-center justify-between">
                        <span>{row.label}</span>
                        <InfoTooltip hintText={row.hintText} hintLink={row.hintLink} hintLinkCustom={row.hintLinkCustom} />
                      </div>
                    </td>
                    {columns.map(({ key }) => {
                      return <td className="cell  text-[#434343]" key={`cell-${key}`}>
                        <TableCell content={row.plans[key]} />
                      </td>
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <QAAccordion />
      <p className="mb-20 px-5 text-center text-[14px] leading-5 text-[#676C77] md:px-10">
        {t('pricing.questions.others')}
        <a
          href="https://tezign.feishu.cn/wiki/AuxBwTKztiQgsDkCdkkcvMqmnDc"
          target="_blank"
          className="text-[#043FFB] underline underline-offset-2"
        >
          {t('pricing.questions.museAI.link')}
        </a>
        {t('pricing.questions.link.des')}
      </p>
    </div>
  )
}
