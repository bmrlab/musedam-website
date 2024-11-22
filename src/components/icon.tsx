import { SVGProps } from 'react'
import { LucideProps } from 'lucide-react'

export type IconProps = SVGProps<SVGSVGElement>

export const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
}

const Icons = {
  locales: (props: IconProps) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 1C4.6 1 1 4.6 1 9C1 13.4 4.6 17 9 17C13.4 17 17 13.4 17 9C17 4.6 13.4 1 9 1ZM2.2 9.57143H4.48571C4.54286 10.6 4.65714 11.5714 4.88571 12.4286H3.05714C2.6 11.5714 2.25714 10.6 2.2 9.57143ZM9.57143 4.42857V2.25714C10.3143 2.54286 11 3.28571 11.5143 4.42857H9.57143ZM11.9714 5.57143C12.2 6.42857 12.3714 7.4 12.4286 8.42857H9.57143V5.57143H11.9714ZM8.42857 2.25714V4.42857H6.48571C7 3.28571 7.68571 2.54286 8.42857 2.25714ZM8.42857 5.57143V8.42857H5.57143C5.62857 7.4 5.8 6.42857 6.02857 5.57143H8.42857ZM4.42857 8.42857H2.14286C2.25714 7.4 2.54286 6.42857 3.05714 5.57143H4.82857C4.6 6.42857 4.48571 7.4 4.42857 8.42857ZM5.57143 9.57143H8.42857V12.4286H6.02857C5.8 11.5714 5.62857 10.6 5.57143 9.57143ZM8.42857 13.5714V15.7429C7.68571 15.4571 7 14.6571 6.48571 13.5714H8.42857ZM9.57143 15.7429V13.5714H11.5143C11 14.7143 10.3143 15.4571 9.57143 15.7429ZM9.57143 12.4286V9.57143H12.4286C12.3714 10.6 12.2 11.5714 11.9714 12.4286H9.57143ZM13.5714 9.57143H15.8571C15.7429 10.6 15.4571 11.5714 14.9429 12.4286H13.1714C13.4 11.5714 13.5143 10.6 13.5714 9.57143ZM13.5714 8.42857C13.5143 7.4 13.4 6.42857 13.1714 5.57143H14.9429C15.4571 6.42857 15.7429 7.4 15.8571 8.42857H13.5714ZM14.0857 4.42857H12.7714C12.5429 3.8 12.2571 3.28571 11.9143 2.82857C12.7714 3.22857 13.5143 3.74286 14.0857 4.42857ZM6.08571 2.82857C5.74286 3.28571 5.45714 3.8 5.22857 4.42857H3.91429C4.48571 3.74286 5.22857 3.22857 6.08571 2.82857ZM3.91429 13.5714H5.22857C5.45714 14.2 5.74286 14.7143 6.08571 15.1714C5.22857 14.7714 4.48571 14.2571 3.91429 13.5714ZM11.9143 15.1714C12.2571 14.7143 12.5429 14.1429 12.7714 13.5714H14.0857C13.5143 14.2571 12.7714 14.7714 11.9143 15.1714Z"
        fill="black"
        fillOpacity="0.8"
      />
    </svg>
  ),
  caretDown: (props: IconProps) => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.84861 3.51562H2.15173C1.92087 3.51562 1.79196 3.75938 1.93493 3.92578L5.78337 8.38828C5.89353 8.51602 6.10564 8.51602 6.21696 8.38828L10.0654 3.92578C10.2084 3.75938 10.0795 3.51562 9.84861 3.51562Z"
        fill="black"
        fillOpacity="0.8"
      />
    </svg>
  ),
  twitter: (props: IconProps) => (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.28875 15.7729C7.41142 15.7803 8.5244 15.5647 9.56306 15.1385C10.6017 14.7123 11.5454 14.0841 12.3392 13.2902C13.1331 12.4964 13.7614 11.5527 14.1876 10.514C14.6137 9.47537 14.8293 8.3624 14.8219 7.23973V6.8516C15.4061 6.42348 15.9107 5.8961 16.3125 5.29348C15.7668 5.53946 15.1861 5.69887 14.5913 5.76598C15.2173 5.39141 15.6852 4.80144 15.9075 4.1066C15.3176 4.45592 14.6729 4.70314 14.0006 4.83785C13.5478 4.35577 12.9485 4.03662 12.2957 3.92995C11.643 3.82328 10.9733 3.93504 10.3905 4.24789C9.80776 4.56074 9.34456 5.05719 9.0728 5.66019C8.80104 6.2632 8.7359 6.93904 8.8875 7.58285C7.69391 7.52461 6.52599 7.21549 5.45987 6.67565C4.39375 6.13581 3.45336 5.37735 2.7 4.44973C2.31523 5.10986 2.19701 5.892 2.36951 6.63636C2.54201 7.38072 2.99221 8.03113 3.62812 8.45473C3.14348 8.44294 2.66957 8.30947 2.25 8.0666V8.10598C2.24942 8.79904 2.48897 9.47089 2.9279 10.0072C3.36683 10.5436 3.97802 10.9113 4.6575 11.0479C4.21549 11.1685 3.75165 11.1858 3.30187 11.0985C3.49503 11.6959 3.86986 12.218 4.37406 12.5921C4.87825 12.9663 5.48665 13.1736 6.11438 13.1854C5.05314 14.0203 3.74094 14.4722 2.39062 14.4679C2.15569 14.4683 1.92092 14.4552 1.6875 14.4285C3.06155 15.3065 4.65814 15.773 6.28875 15.7729Z"
        fill="#141414"
      />
    </svg>
  ),
  instagram: (props: IconProps) => (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 4.06738C10.8787 4.06738 11.0981 4.06738 11.8406 4.11238C12.2867 4.11335 12.7289 4.1953 13.1456 4.35426C13.4526 4.46338 13.7299 4.64249 13.9556 4.87738C14.1905 5.10311 14.3696 5.38043 14.4788 5.68738C14.6411 6.11299 14.7231 6.565 14.7206 7.02051C14.76 7.76301 14.7656 7.98238 14.7656 9.86113C14.7656 11.7399 14.7656 11.9593 14.7206 12.7018C14.7197 13.1478 14.6377 13.59 14.4788 14.0068C14.3639 14.3109 14.1856 14.5871 13.9558 14.8169C13.7259 15.0468 13.4497 15.2251 13.1456 15.3399C12.7289 15.4988 12.2867 15.5808 11.8406 15.5818C11.0981 15.6211 10.8787 15.6268 9 15.6268C7.12125 15.6268 6.90188 15.6268 6.15937 15.5818C5.71332 15.5808 5.27115 15.4988 4.85438 15.3399C4.54742 15.2308 4.2701 15.0517 4.04437 14.8168C3.80948 14.591 3.63038 14.3137 3.52125 14.0068C3.36229 13.59 3.28034 13.1478 3.27937 12.7018C3.24 11.9593 3.23438 11.7399 3.23438 9.86113C3.23438 7.98238 3.23438 7.76301 3.27937 7.02051C3.28034 6.57445 3.36229 6.13228 3.52125 5.71551C3.63038 5.40856 3.80948 5.13123 4.04437 4.90551C4.2701 4.67061 4.54742 4.49151 4.85438 4.38238C5.27814 4.21043 5.73022 4.11887 6.1875 4.11238C6.93 4.07301 7.14937 4.06738 9.02812 4.06738M9 2.80176C7.09312 2.80176 6.85125 2.80176 6.10313 2.84676C5.52637 2.86068 4.95601 2.97095 4.41562 3.17301C3.93824 3.34447 3.50565 3.62133 3.15 3.98301C2.79113 4.33217 2.51444 4.7568 2.34 5.22613C2.13795 5.76651 2.02768 6.33688 2.01375 6.91363C1.97437 7.68426 1.96875 7.92613 1.96875 9.83301C1.96875 11.7399 1.96875 11.9818 2.01375 12.7299C2.02768 13.3066 2.13795 13.877 2.34 14.4174C2.51146 14.8948 2.78832 15.3274 3.15 15.683C3.49916 16.0419 3.9238 16.3186 4.39313 16.493C4.93351 16.6951 5.50387 16.8053 6.08063 16.8193C6.82875 16.8586 7.07062 16.8643 8.9775 16.8643C10.8844 16.8643 11.1263 16.8643 11.8744 16.8193C12.4511 16.8053 13.0215 16.6951 13.5619 16.493C14.0281 16.3124 14.4515 16.0365 14.805 15.683C15.1585 15.3295 15.4344 14.9061 15.615 14.4399C15.8171 13.8995 15.9273 13.3291 15.9412 12.7524C15.9806 12.0043 15.9862 11.7624 15.9862 9.85551C15.9862 7.94863 15.9862 7.70676 15.9412 6.95863C15.9273 6.38188 15.8171 5.81151 15.615 5.27113C15.4597 4.78987 15.1983 4.34965 14.85 3.98301C14.5008 3.62414 14.0762 3.34745 13.6069 3.17301C13.0665 2.97095 12.4961 2.86068 11.9194 2.84676C11.1488 2.80738 10.9069 2.80176 9 2.80176ZM9 6.22176C8.28576 6.22176 7.58756 6.43355 6.9937 6.83036C6.39983 7.22717 5.93697 7.79117 5.66364 8.45104C5.39031 9.11091 5.3188 9.83701 5.45814 10.5375C5.59748 11.238 5.94142 11.8815 6.44646 12.3865C6.9515 12.8916 7.59497 13.2355 8.29548 13.3749C8.99599 13.5142 9.7221 13.4427 10.382 13.1694C11.0418 12.896 11.6058 12.4332 12.0026 11.8393C12.3995 11.2454 12.6112 10.5472 12.6112 9.83301C12.612 9.35856 12.5191 8.88864 12.3379 8.45017C12.1566 8.01169 11.8907 7.6133 11.5552 7.27782C11.2197 6.94233 10.8213 6.67636 10.3828 6.49514C9.94437 6.31392 9.47444 6.22102 9 6.22176ZM9 12.1786C8.53608 12.1786 8.08258 12.0411 7.69684 11.7833C7.3111 11.5256 7.01046 11.1592 6.83293 10.7306C6.65539 10.302 6.60894 9.83041 6.69945 9.3754C6.78995 8.92039 7.01335 8.50244 7.34139 8.1744C7.66943 7.84636 8.08738 7.62296 8.54239 7.53245C8.9974 7.44195 9.46903 7.4884 9.89763 7.66593C10.3262 7.84347 10.6926 8.14411 10.9503 8.52985C11.2081 8.91558 11.3456 9.36909 11.3456 9.83301C11.3456 10.4551 11.0985 11.0517 10.6586 11.4916C10.2187 11.9315 9.6221 12.1786 9 12.1786ZM12.7519 5.23738C12.585 5.23738 12.4219 5.28687 12.2831 5.37958C12.1444 5.47229 12.0362 5.60407 11.9724 5.75824C11.9085 5.91242 11.8918 6.08207 11.9243 6.24574C11.9569 6.40941 12.0373 6.55975 12.1553 6.67775C12.2733 6.79575 12.4236 6.87611 12.5873 6.90867C12.7509 6.94123 12.9206 6.92452 13.0748 6.86066C13.2289 6.79679 13.3607 6.68865 13.4534 6.54989C13.5461 6.41114 13.5956 6.24801 13.5956 6.08113C13.5956 5.85736 13.5067 5.64275 13.3485 5.48451C13.1903 5.32628 12.9757 5.23738 12.7519 5.23738Z"
        fill="#141414"
      />
    </svg>
  ),
  linkedin: (props: IconProps) => (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.0167 16.833H3.98333C3.45732 16.833 2.95285 16.6241 2.5809 16.2521C2.20896 15.8802 2 15.3757 2 14.8497V4.81634C2 4.29033 2.20896 3.78586 2.5809 3.41391C2.95285 3.04197 3.45732 2.83301 3.98333 2.83301H14.0167C14.5427 2.83301 15.0471 3.04197 15.4191 3.41391C15.791 3.78586 16 4.29033 16 4.81634V14.8497C16 15.3757 15.791 15.8802 15.4191 16.2521C15.0471 16.6241 14.5427 16.833 14.0167 16.833ZM6.62583 14.5522V8.22884H4.52583V14.5522H6.62583ZM7.7925 14.5522H9.8925V10.9997C9.88622 10.8258 9.9099 10.6522 9.9625 10.4863C10.043 10.2636 10.1893 10.0707 10.3821 9.93317C10.5748 9.79563 10.8049 9.72 11.0417 9.71634C11.8 9.71634 12.1092 10.2997 12.1092 11.1455V14.5288H14.2092V10.9297C14.2092 8.98717 13.1708 8.08301 11.7883 8.08301C11.4036 8.06811 11.0222 8.15926 10.6858 8.3465C10.3494 8.53374 10.0709 8.80986 9.88083 9.14467V8.22884H7.78667C7.81583 8.81217 7.78667 14.5522 7.78667 14.5522H7.7925ZM6.76583 6.27467C6.76738 6.12968 6.74015 5.98582 6.68573 5.85141C6.63131 5.71701 6.55077 5.59473 6.44878 5.49166C6.34679 5.38859 6.22537 5.30676 6.09156 5.25092C5.95774 5.19508 5.81417 5.16633 5.66917 5.16634H5.5C5.35451 5.16556 5.21031 5.19374 5.07582 5.24923C4.94132 5.30473 4.81921 5.38643 4.7166 5.48958C4.61399 5.59273 4.53293 5.71527 4.47815 5.85006C4.42337 5.98485 4.39595 6.12919 4.3975 6.27467C4.39749 6.41891 4.42609 6.56172 4.48164 6.69483C4.53718 6.82794 4.61858 6.94872 4.72111 7.05016C4.82364 7.15161 4.94528 7.23172 5.07897 7.28585C5.21267 7.33997 5.35577 7.36705 5.5 7.36551H5.675C5.81825 7.36551 5.9601 7.33729 6.09244 7.28247C6.22479 7.22765 6.34504 7.1473 6.44634 7.04601C6.54763 6.94472 6.62798 6.82446 6.6828 6.69212C6.73762 6.55977 6.76583 6.41792 6.76583 6.27467Z"
        fill="#141414"
      />
    </svg>
  ),
  youtube: (props: IconProps) => (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.12439 4.1351C9.87578 4.14595 10.4946 4.15224 11.1157 4.16767C11.6203 4.1791 12.1248 4.19852 12.6288 4.22024C13.3464 4.24672 14.0628 4.30162 14.7761 4.3848C15.0881 4.41965 15.3892 4.50079 15.664 4.65678C16.1966 4.95677 16.5297 5.41274 16.6685 6.01557C16.7485 6.36812 16.8045 6.72753 16.8503 7.08751C16.9325 7.75776 16.9737 8.43315 16.9908 9.11025C17.004 9.61194 17.004 10.1159 16.9845 10.6182C16.9694 11.0211 16.9456 11.4236 16.9131 11.8255C16.8828 12.1855 16.844 12.5426 16.7937 12.8998C16.7571 13.1695 16.7137 13.4386 16.6491 13.702C16.5491 14.1054 16.3309 14.438 16.0189 14.7077C15.7332 14.9556 15.4018 15.1019 15.0338 15.1682C14.6973 15.2249 14.3588 15.2687 14.019 15.2996C13.4733 15.3499 12.9276 15.3808 12.3825 15.4025C10.8929 15.4659 9.4038 15.4768 7.91188 15.4551C7.44364 15.4493 6.97545 15.4392 6.50739 15.4248C5.96399 15.4048 5.42288 15.3785 4.88176 15.3522C4.61293 15.3382 4.34434 15.3199 4.07609 15.2973C3.67154 15.2648 3.26471 15.2271 2.86645 15.1488C2.34647 15.0454 1.93964 14.7648 1.63223 14.3311C1.45681 14.0831 1.35339 13.8026 1.29282 13.5043C1.21121 13.0944 1.15113 12.6805 1.11283 12.2644C1.01405 11.2352 0.980077 10.2008 1.01112 9.16739C1.02198 8.75027 1.0414 8.3343 1.06769 7.92003C1.09569 7.44463 1.1454 6.97151 1.21911 6.50011C1.25339 6.27384 1.28196 6.04414 1.3551 5.82701C1.58252 5.14704 2.03963 4.7025 2.71674 4.49908C2.87502 4.45051 3.03958 4.43051 3.20414 4.4088C3.48755 4.37166 3.77097 4.33909 4.05667 4.31052C4.29665 4.28652 4.53721 4.26881 4.78006 4.25338C5.15889 4.23166 5.53773 4.20938 5.91656 4.19395C6.31254 4.1791 6.70852 4.16538 7.10507 4.1591C7.82103 4.14767 8.53756 4.14195 9.12439 4.13281V4.1351ZM11.6311 9.8005C10.2523 9.00055 8.88212 8.20288 7.51133 7.40692C7.49419 7.39835 7.47705 7.38978 7.46162 7.38063H7.45591C7.45591 7.38063 7.45134 7.38063 7.44905 7.38292C7.43591 7.58862 7.4422 12.1632 7.45762 12.2204L11.6311 9.7965V9.8005Z"
        fill="#141414"
      />
    </svg>
  ),
  // 移动端菜单按钮
  showMore: (props: IconProps) => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2642_14539)">
        <rect x="0.5" y="8" width="24" height="2.25" fill="white" />
        <rect x="11.75" y="14.75" width="12.75" height="2.25" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_2642_14539">
          <rect width="21" height="21" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  ),
  arrowRight: (props: IconProps) => (
    <svg viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M11.2835 11L16 6M16 6L11.2835 1M16 6H0" stroke="currentColor" stroke-width="1.3" stroke-miterlimit="10" stroke-linejoin="bevel" />
    </svg>
  )
}

export default Icons
