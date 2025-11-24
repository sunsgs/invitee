import { CheckCircle, PaintBucket, Palette, Type, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

export default function FeatureSection() {
  const t = useTranslations("HOMEPAGE.FEATURES");
  return (
    <section className="my-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-32 text-center">
          <h2 className="mb-6">{t("TITLE")}</h2>
          <p className="text-lg">{t("SUBTITLE")}</p>
        </div>

        {/* Features Grid */}
        <div className="flex flex-col gap-24 text-center md:text-left">
          {/* Feature 1 - Personalizza */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 flex justify-center items-center gap-2 relative">
              <PaintBucket className="h-8 w-8" />
              <Palette className="h-8 w-8" />
              <Type className="h-8 w-8" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3>{t("FEATURE1.TITLE")}</h3>
              <p className="leading-relaxed">{t("FEATURE1.COPY")}</p>
            </div>
          </div>

          {/* Feature 2 - Emoji */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3>{t("FEATURE2.TITLE")}</h3>
              <p className="leading-relaxed">{t("FEATURE2.COPY")}</p>
            </div>
            <div className="relative h-64 w-64 mx-auto">
              {/* Center emoji */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl z-10">
                🥳
              </div>

              {/* Top emoji */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl pointer-events-none">
                🎄
              </div>

              {/* Top-right emoji */}
              <div className="absolute top-[13%] right-[13%] text-4xl pointer-events-none">
                🎃
              </div>

              {/* Bottom-right emoji */}
              <div className="absolute bottom-[13%] right-[13%] text-xl pointer-events-none">
                💞
              </div>

              {/* Bottom emoji */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-5xl pointer-events-none">
                🍕
              </div>

              {/* Bottom-left emoji */}
              <div className="absolute bottom-[13%] left-[13%] text-lg pointer-events-none">
                🎉
              </div>

              {/* Top-left emoji */}
              <div className="absolute top-[13%] left-[13%] text-5xl pointer-events-none">
                🎁
              </div>
            </div>
          </div>

          {/* Feature 3 - RSVP */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 px-4 md:px-16 text-left">
              <div className="space-y-3">
                {/* RSVP Item 1 */}
                <div className="bg-muted-foreground/10 backdrop-blur-xl border border-muted-foreground/20 shadow rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                        <User className="w-5 h-5 " />
                      </div>
                      <div>
                        <div className="font-semibold">John Doe</div>
                        <div className="text-sm">1 Guest + 2 babies</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">coming</span>
                    </div>
                  </div>
                </div>
                {/* RSVP Item 2 */}
                <div className="bg-muted-foreground/10 shadow backdrop-blur-xl border border-muted-foreground/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                        <User className="w-5 h-5 " />
                      </div>
                      <div>
                        <div className="font-semibold">John Doe</div>
                        <div className="text-sm">1 Guest + 2 babies</div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">coming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3>{t("FEATURE3.TITLE")}</h3>
              <p className="leading-relaxed">{t("FEATURE3.COPY")}</p>
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-48 text-center">
          <p className="text-lg">
            E poi? Condividi il tuo invito nel mondo, ovunque,
            <br />
            come un meme virale.
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <Button className="px-12 py-6 mt-4 shadow-xl text-xl border-b-4 bg-primary/90 border-primary">
            <Link href="#">Invita con stile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
