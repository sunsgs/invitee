import {
  CheckCircle,
  CircleX,
  Clock,
  PaintBucket,
  PartyPopper,
  User,
  UsersRound,
} from "lucide-react";

export default function FeatureSection2() {
  return (
    <section className="py-16">
      <div className="mx-auto px-6 max-w-6xl">
        <div className="relative">
          <div className="relative z-10 grid gap-4 grid-cols-1 md:grid-cols-4">
            {/* RSVP */}
            <div className="col-span-2 relative text-white bg-primary rounded-xl p-10 shadow  overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <UsersRound className="w-6 h-" />
                  </div>
                  <h2 className="text-3xl font-semibold">
                    Instant RSVP Tracking
                  </h2>
                </div>

                <p className="leading-relaxed mb-6">
                  Know who’s coming, who’s maybe-ing, and who’s ghosting your
                  party. No more guesswork.
                </p>
                <div className="flex w-fit mb-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg  flex gap-2 divide-x divide-white/20 ">
                    <div className="py-2 px-4 flex flex-col text-center items-center">
                      <div className="font-semibold text-sm">CONFIRMED</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div className="py-2 px-4 flex flex-col text-center items-center">
                      <div className="font-semibold text-sm">MAYBE</div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <div className="py-2 px-4 flex flex-col text-center items-center">
                      <div className="font-semibold text-sm">DECLINED</div>
                      <div className="text-2xl font-bold">4</div>
                    </div>
                  </div>
                </div>

                {/* Reminder Cards */}
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold"></div>
                          <div className="text-sm text-purple-200">
                            1 Guest + 2 babies
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span className="text-sm">coming</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">John Doe</div>
                          <div className="text-sm text-purple-200"></div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <CircleX className="w-5 h-5 text-red-300" />
                        <span className="text-sm">not coming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* EMOJI */}
            <div className="col-span-2 relative rounded-xl p-10 shadow overflow-hidden group border">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/30 backdrop-blur-sm flex items-center justify-center border border-opacity-30">
                    <PartyPopper className="w-6 h-6" />
                  </div>
                  <h2 className="">Pick Your Emoji</h2>
                </div>

                <p className="leading-relaxed mb-6">
                  Add personality with the perfect emoji—because a party without
                  emoji is just a meeting.
                </p>
                <div
                  id="emoji-cloud"
                  className="relative w-full h-56 mt-6 select-none"
                  aria-hidden="true"
                >
                  {/* Core row */}
                  <span className="absolute top-[18%] left-[16%] text-[4rem] ">
                    🎉
                  </span>
                  <span className="absolute top-[28%] left-[72%] text-[3rem] ">
                    🎈
                  </span>
                  <span className="absolute top-[56%] left-[30%] text-[2.5rem] ">
                    🎃
                  </span>
                  <span className="absolute top-[68%] left-[60%] text-[5rem] ">
                    🎄
                  </span>
                  <span className="absolute top-[14%] left-[44%] text-[2rem] ">
                    🥳
                  </span>
                  <span className="absolute top-[78%] left-[23%] text-[3rem] ">
                    🎊
                  </span>

                  {/* Subtle fillers to balance whitespace */}
                  <span className="absolute top-[40%] left-[50%] text-[2.25rem] ">
                    ❤️
                  </span>
                  <span className="absolute top-[32%] left-[8%] text-[1.75rem] ">
                    🎈
                  </span>
                  <span className="absolute top-[70%] left-[78%] text-[2.5rem] ">
                    🎉
                  </span>
                  <span className="absolute top-[12%] left-[82%] text-[1.75rem] ">
                    ✨
                  </span>
                </div>
              </div>
            </div>

            {/* RSVP */}
            <div className="col-span-1 relative border rounded-xl p-10 shadow group">
              <div className="relative z-10">
                <div className="flex  gap-3 mb-4 flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/3 backdrop-blur-sm flex items-center justify-center border border/30">
                    <PaintBucket className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-semibold">Color Your Mood</h2>
                </div>

                <p className="leading-relaxed mb-6">
                  Choose your background and text colors to set the perfect
                  atmosphere. Be bold, subtle, or totally you.
                </p>
              </div>
            </div>

            {/* QR Check-in Card */}
            <div className="col-span-1 bg-gradient-to-br from-cyan-500 to-blue-500 border border-cyan-400 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">QR Check-in</h3>
                <p className="text-cyan-100">Seamless event entry</p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-400/30 rounded-full blur-2xl"></div>
            </div>

            {/* Live Updates Card */}
            <div className="col-span-2 bg-white border border-gray-200 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  Live Updates
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Real-time notifications keep everyone informed. Changes sync
                instantly across all devices.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                <div
                  className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
