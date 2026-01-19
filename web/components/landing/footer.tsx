import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const footerLinks = [
    {
      title: "Platform",
      items: [
        { label: "Patient Portal", href: "/patient" },
        { label: "Provider Portal", href: "/provider" },
        { label: "Concierge Portal", href: "/concierge" },
        { label: "Mobile App", href: "#" },
        { label: "Lab Partners", href: "#" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Hormone Optimization", href: "/treatments/testosterone-replacement-therapy" },
        { label: "Executive Wellness", href: "/treatments/testosterone-boosters" },
        { label: "Sexual Wellness", href: "/treatments/sexual-wellness" },
        { label: "Longevity", href: "#" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About Us", href: "#" },
        { label: "Medical Team", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ]

  return (
    <footer className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 pb-8 sm:pb-12 border-b border-border">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-4 sm:mb-6">
              <Image src="/adonis-logo.png" alt="ADONIS" width={120} height={32} className="h-6 sm:h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 max-w-sm text-sm sm:text-base">
              Premium telemedicine for executive men's health and hormone optimization.
            </p>
            <p className="text-mono-upper text-muted-foreground text-xs sm:text-sm">Sister brand of ATHENA Health</p>
          </div>

          {footerLinks.map((column, i) => (
            <div key={i}>
              <h4 className="text-mono-upper text-foreground mb-4 sm:mb-6 text-xs sm:text-sm">{column.title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} ADONIS Health. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            {["Privacy", "Terms", "HIPAA"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-mono-upper text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
