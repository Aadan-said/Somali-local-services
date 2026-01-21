import {
    Search,
    BookOpen,
    MessageCircle,
    Shield,
    CreditCard,
    User,
    Settings,
    ArrowRight,
    HelpCircle,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
    const categories = [
        { icon: User, title: "Koontadaada", description: "Sida loo habeeyo profile-ka iyo amniga." },
        { icon: CreditCard, title: "Lacag Bixinta", description: "Warbixin ku saabsan lacag bixinta iyo qaadashada." },
        { icon: Shield, title: "Amniga & Shuruudaha", description: "Sideed u nabad gali kartaa adigoo isticmaalaya madasheena." },
        { icon: Settings, title: "Adeegga Macmiilka", description: "Sidee nala soo xiriiri kartaa oo gacan u heli kartaa." }
    ];

    const faqs = [
        {
            question: "Sidee baan isku diiwaangeliyaa?",
            answer: "Waxaad isaga diiwaangelin kartaa batoonka 'Register' ee ku yaala kore midig, markaas ka dib dooro haddii aad tahay Macmiil ama Adeeg-bixiye."
        },
        {
            question: "Lacagta sidee loo bixiyaa?",
            answer: "Waxaan aqbalnaa adeegyada mobile money-ga sida EVC Plus, Sahal, iyo SAAD. Sidoo kale waxaad isticmaali kartaa kaararka bangiga."
        },
        {
            question: "Ma jiraan khidmado qarsoon?",
            answer: "Maya, ma jiraan wax khidmado qarsoon ah. Qiimaha aad ku heshiisaan adiga iyo adeeg-bixiyaha waa midka kama dambaysta ah."
        },
        {
            question: "Haddii dhib dhaco, sidee u xalinayaa?",
            answer: "Waxaad nala soo xiriiri kartaa 24/7 adiga oo isticmaalaya bogga 'Contact Us' ama help center-kayaga si aan kuugu gargaarno."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden border-b border-border/10">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />

                {/* Dynamic Background Elements */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse -z-10" />

                <div className="container px-6 md:px-12 lg:px-24 text-center relative z-10">
                    <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/20 backdrop-blur-md mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Sidee ayaan kuu caawin karnaa?</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-12">
                        Xarunta <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Caawinta</span>
                    </h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Raadi jawaabaha (tusaale: 'Sidee loo bixiyaa lacagta?')"
                                className="h-20 pl-16 pr-8 rounded-[2.5rem] bg-background/50 backdrop-blur-xl border-2 border-border/50 focus:border-primary/50 text-xl shadow-2xl transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 bg-muted/20 dark:bg-muted/5 border-b border-border/10 relative -isolate overflow-hidden">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, i) => (
                            <div key={i} className="p-10 rounded-4xl glass border-border/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all group text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 mx-auto group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <cat.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
                                <p className="text-base text-muted-foreground leading-relaxed">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24">
                <div className="container px-6 md:px-12 lg:px-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-black tracking-tight">Su'aalaha Inta Badan La Is Waydiiyo</h2>
                            <p className="text-lg text-muted-foreground">Jawaabo degdeg ah oo ku saabsan su'aalaha caanka ah.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-none">
                                    <AccordionTrigger className="text-left text-xl font-bold p-8 rounded-3xl glass border-border/5 hover:border-primary/20 hover:no-underline transition-all group-data-[state=open]:text-primary group-data-[state=open]:shadow-lg">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-8 text-lg text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Still need help? */}
            <section className="py-24 bg-muted/30">
                <div className="container px-6 md:px-12 lg:px-24 text-center">
                    <div className="max-w-3xl mx-auto p-12 rounded-[3.5rem] bg-background border border-border/50 shadow-2xl relative overflow-hidden isolate">
                        <div className="absolute top-0 right-0 p-8 text-primary/5 -rotate-12 -z-10">
                            <HelpCircle className="h-48 w-48" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Wali ma u baahan tahay caawimaad?</h2>
                        <p className="text-lg text-muted-foreground mb-10">
                            Kooxdayada caawinta macmiilka waxay joogaan 24-ka saac si ay kuu caawiyaan.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary shadow-xl hover:scale-105 active:scale-95 transition-all text-lg font-bold">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Nala Soo Hadal
                                </Button>
                            </Link>
                            <a href="mailto:support@somaliservices.so">
                                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-2 text-lg font-bold hover:bg-muted/50 transition-all">
                                    Email noo soo dir
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

