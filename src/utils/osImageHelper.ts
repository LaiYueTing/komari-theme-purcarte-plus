/**
 * OS Image Helper - 根據字串比對回傳作業系統圖片路徑
 */

// 作業系統比對設定
interface OSConfig {
  name: string;
  image: string;
  keywords: string[];
}

// 作業系統比對群組
const osConfigs: OSConfig[] = [
  {
    name: "Alibaba",
    image: "/assets/logo/os-alibaba.svg",
    keywords: ["alibaba"],
  },
  {
    name: "AlmaLinux",
    image: "/assets/logo/os-alma.svg",
    keywords: ["alma", "almalinux"],
  },
  {
    name: "Alpine Linux",
    image: "/assets/logo/os-alpine.webp",
    keywords: ["alpine", "alpine linux"],
  },
  {
    name: "Arch Linux",
    image: "/assets/logo/os-arch.svg",
    keywords: ["arch", "archlinux", "arch linux"],
  },
  {
    name: "Armbian",
    image: "/assets/logo/os-armbian.svg",
    keywords: ["armbian"],
  },
  {
    name: "Astra Linux",
    image: "/assets/logo/os-astra.svg",
    keywords: ["astra", "astra linux"],
  },
  {
    name: "CentOS",
    image: "/assets/logo/os-centos.svg",
    keywords: ["centos", "cent os"],
  },
  {
    name: "Debian",
    image: "/assets/logo/os-debian.svg",
    keywords: ["debian", "deb"],
  },
  {
    name: "Fedora",
    image: "/assets/logo/os-fedora.svg",
    keywords: ["fedora"],
  },
  {
    name: "FreeBSD",
    image: "/assets/logo/os-freebsd.svg",
    keywords: ["freebsd", "bsd"],
  },
  {
    name: "Gentoo",
    image: "/assets/logo/os-gentoo.svg",
    keywords: ["gentoo"],
  },
  {
    name: "Huawei",
    image: "/assets/logo/os-huawei.svg",
    keywords: ["huawei", "euleros", "euler os"],
  },
  {
    name: "ImmortalWrt",
    image: "/assets/logo/os-openwrt.svg",
    keywords: ["immortalwrt", "immortal", "emmortal"],
  },
  {
    name: "Orange Pi",
    image: "/assets/logo/os-orange-pi.svg",
    keywords: ["orange pi", "orangepi"],
  },
  {
    name: "iStoreOS",
    image: "/assets/logo/os-istore.png",
    keywords: ["istore", "istoreos", "istore os"],
  },
  {
    name: "Kali Linux",
    image: "/assets/logo/os-kail.svg",
    keywords: ["kail", "kali", "kali linux"],
  },
  {
    name: "macOS",
    image: "/assets/logo/os-macos.svg",
    keywords: ["macos"],
  },
  {
    name: "Manjaro",
    image: "/assets/logo/os-manjaro.svg",
    keywords: ["manjaro"],
  },
  {
    name: "Linux Mint",
    image: "/assets/logo/os-mint.svg",
    keywords: ["mint", "linux mint"],
  },
  {
    name: "NixOS",
    image: "/assets/logo/os-nix.svg",
    keywords: ["nixos", "nix os", "nix"],
  },
  {
    name: "OpenCloudOS",
    image: "/assets/logo/os-opencloud.svg",
    keywords: ["opencloud"],
  },
  {
    name: "openSUSE",
    image: "/assets/logo/os-openSUSE.svg",
    keywords: ["opensuse", "suse"],
  },
  {
    name: "OpenWrt",
    image: "/assets/logo/os-openwrt.svg",
    keywords: ["openwrt", "open wrt", "open-wrt", "qwrt"],
  },
  {
    name: "Proxmox VE",
    image: "/assets/logo/os-proxmox.ico",
    keywords: ["proxmox", "proxmox ve"],
  },
  {
    name: "Red Hat",
    image: "/assets/logo/os-redhat.svg",
    keywords: ["redhat", "rhel", "red hat"],
  },
  {
    name: "Rocky Linux",
    image: "/assets/logo/os-rocky.svg",
    keywords: ["rocky", "rocky linux"],
  },
  {
    name: "Synology DSM",
    image: "/assets/logo/os-synology.ico",
    keywords: ["synology", "dsm", "synology dsm"],
  },
  {
    name: "Ubuntu",
    image: "/assets/logo/os-ubuntu.svg",
    keywords: ["ubuntu", "elementary"],
  },
  {
    name: "Unraid",
    image: "/assets/logo/os-unraid.svg",
    keywords: ["unraid"],
  },
  {
    name: "Windows",
    image: "/assets/logo/os-windows.svg",
    keywords: ["windows", "win", "microsoft", "ms"],
  },
];

// 預設設定
const defaultOSConfig: OSConfig = {
  name: "Unknown",
  image: "/assets/logo/linux.svg",
  keywords: ["unknown"],
};

/**
 * 根據輸入字串尋找符合的作業系統設定
 * @param osString - 作業系統相關的字串
 * @returns 符合的作業系統設定，如果沒有符合則回傳預設設定
 */
function findOSConfig(osString: string): OSConfig {
  if (!osString) {
    return defaultOSConfig;
  }

  const normalizedInput = osString.toLowerCase().trim();

  // 走訪比對設定
  for (const config of osConfigs) {
    for (const keyword of config.keywords) {
      if (normalizedInput.includes(keyword)) {
        return config;
      }
    }
  }

  // 如果沒有符合的，回傳預設設定
  return defaultOSConfig;
}

/**
 * 根據輸入字串比對回傳作業系統圖片路徑
 * @param osString - 作業系統相關的字串
 * @returns 符合的作業系統圖片路徑，如果沒有符合則回傳預設圖片
 */
export function getOSImage(osString: string): string {
  return findOSConfig(osString).image;
}

/**
 * 取得所有可用的作業系統圖片
 * @returns 所有作業系統圖片的對照表
 */
export function getAllOSImages(): Record<string, string> {
  const imageMap: Record<string, string> = {};

  osConfigs.forEach((config) => {
    const key = config.keywords[0]; // 使用第一個關鍵字作為鍵
    imageMap[key] = config.image;
  });

  imageMap.unknown = defaultOSConfig.image;

  return imageMap;
}

/**
 * 根據輸入字串比對回傳作業系統名稱
 * @param osString - 作業系統相關的字串
 * @returns 符合的作業系統名稱
 */
export function getOSName(osString: string): string {
  const config = findOSConfig(osString);

  // 如果比對到具體的作業系統，回傳其名稱
  if (config !== defaultOSConfig) {
    return config.name;
  }

  // 如果沒有符合的，從輸入字串中擷取名稱
  if (!osString) {
    return "Unknown";
  }

  // 使用空格或斜線分割，取第一個部分
  const parts = osString.trim().split(/[\s/]/);
  return parts[0] || "Unknown";
}

/**
 * 檢查是否為支援的作業系統
 * @param osString - 作業系統相關的字串
 * @returns 是否為支援的作業系統
 */
export function isSupportedOS(osString: string): boolean {
  if (!osString) return false;

  const config = findOSConfig(osString);
  return config !== defaultOSConfig;
}
