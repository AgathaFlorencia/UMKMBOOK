"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const MENU_UTAMA: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "/dashboard/business-model-canvas.png" },
  { href: "/transaksi", label: "Transaksi", icon: "/dashboard/purchase-order-2.png" },
  { href: "/produk", label: "Produk", icon: "/dashboard/image-2.png" },
  { href: "/riwayat", label: "Riwayat", icon: "/dashboard/time-machine.png" },
  { href: "/kasbon", label: "Kasbon", icon: "/dashboard/debt.png" },
];

const MENU_AKUN: NavItem[] = [
  { href: "/settings", label: "Settings", icon: "/dashboard/settings.png" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-0 hidden h-screen w-[226px] shrink-0 flex-col overflow-y-auto bg-white md:flex"
      aria-label="Sidebar navigation"
    >
      <div className="ml-7 mt-[45px]">
        <Image
          src="/dashboard/logo-UMKM-book.png"
          alt="Logo UMKM Book"
          width={174}
          height={64}
          priority
        />
      </div>

      <nav className="mt-[60px] flex flex-col gap-3.5" aria-label="Main navigation">
        {MENU_UTAMA.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`mx-[29px] flex items-center gap-2.5 rounded-lg px-[18px] py-3.5 text-[17.2px] transition-colors ${
                isActive
                  ? "bg-[linear-gradient(90deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] text-white"
                  : "text-black hover:bg-gray-50"
              }`}
            >
              <Image src={item.icon} alt="" width={22} height={22} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <nav className="mt-auto mb-[49px] flex flex-col gap-6" aria-label="Account navigation">
        {MENU_AKUN.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-12 flex items-center gap-2.5 text-[17.2px] ${
                isActive ? "text-black" : "text-[#999999]"
              } hover:text-black`}
            >
              <Image src={item.icon} alt="" width={22} height={22} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <LogoutButton />
      </nav>
    </aside>
  );
}

function LogoutButton() {
  async function handleLogout() {
    // TODO: sambungkan ke logout Supabase yang sudah ada di project, misalnya:
    // const supabase = createClient();
    // await supabase.auth.signOut();
    // router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mx-12 flex items-center gap-2.5 text-left text-[17.2px] text-[#999999] hover:text-black"
    >
      <Image
        src="/dashboard/logout-rounded-left.png"
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
      />
      <span>Log Out</span>
    </button>
  );
}