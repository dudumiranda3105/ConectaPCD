import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Building2,
  CheckCircle2,
  Heart,
  Shield,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Hook para detectar quando elemento está visível
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true); // Começa como true para garantir visibilidade

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Componente animado
function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.1);

  const animations = {
    "fade-up": "translate-y-16 opacity-0",
    "fade-left": "-translate-x-16 opacity-0",
    "fade-right": "translate-x-16 opacity-0",
    scale: "scale-90 opacity-0",
    fade: "opacity-0",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isInView ? "translate-y-0 translate-x-0 scale-100 opacity-100" : animations[animation]
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section com parallax */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div
            className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s", transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div
            className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s", transform: `translateY(${scrollY * 0.1}px)` }}
          />
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 mb-6 lg:mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Conectando talentos e oportunidades</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 lg:mb-8 leading-none tracking-tighter">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              ConectaPCD
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-3xl xl:max-w-4xl mx-auto mb-8 lg:mb-12 leading-relaxed px-4">
            A plataforma que une{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">pessoas com deficiência</span> a{" "}
            <span className="font-semibold text-pink-600 dark:text-pink-400">empresas inclusivas</span>, criando um
            mercado de trabalho mais diverso e acessível.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link to="/cadastro/candidato">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 group"
              >
                Sou Candidato PCD
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/cadastro/empresa">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-border hover:border-purple-400 px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg rounded-xl hover:bg-purple-500/10 transition-all duration-300 hover:-translate-y-1 group"
              >
                Sou Empresa
                <Building2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats flutuantes */}
          <div className="mt-12 lg:mt-20 grid grid-cols-3 gap-4 lg:gap-8 max-w-2xl xl:max-w-3xl mx-auto px-4">
            {[
              { number: "500+", label: "Vagas Ativas" },
              { number: "1000+", label: "Candidatos" },
              { number: "200+", label: "Empresas" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-3 lg:p-4 rounded-2xl bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow border border-border/50"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent dark:from-purple-500/10" />
        <div className="container mx-auto px-4 relative">
          <AnimatedSection animation="fade-up" className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 text-foreground">
              Por que escolher o{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                ConectaPCD
              </span>
              ?
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg xl:text-xl max-w-2xl mx-auto">
              Uma plataforma pensada para criar conexões significativas
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Target,
                title: "Match Inteligente",
                description:
                  "Algoritmo que conecta candidatos às vagas mais compatíveis com seu perfil",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: Shield,
                title: "100% Acessível",
                description:
                  "Plataforma desenvolvida seguindo diretrizes de acessibilidade digital",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Heart,
                title: "Empresas Inclusivas",
                description:
                  "Parceiros comprometidos com diversidade e inclusão no ambiente de trabalho",
                gradient: "from-pink-500 to-pink-600",
              },
              {
                icon: TrendingUp,
                title: "Crescimento",
                description: "Oportunidades de desenvolvimento profissional e pessoal contínuo",
                gradient: "from-green-500 to-green-600",
              },
            ].map((feature, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 100}>
                <Card className="group h-full border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-card">
                  <CardContent className="p-6 lg:p-8 relative">
                    <div
                      className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm lg:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Para Candidatos */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection animation="fade-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20" />
                <Card className="relative border-0 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-8 lg:p-12 text-white">
                      <Users className="w-12 h-12 lg:w-16 lg:h-16 mb-6 opacity-90" />
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">
                        Para Candidatos PCD
                      </h3>
                      <p className="text-purple-100 text-base lg:text-lg mb-8">
                        Encontre oportunidades que valorizam seu talento e respeitam suas
                        necessidades
                      </p>
                      <ul className="space-y-4">
                        {[
                          "Cadastro gratuito e simplificado",
                          "Vagas filtradas por acessibilidade",
                          "Chat direto com recrutadores",
                          "Acompanhamento de candidaturas",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm lg:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={200}>
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-foreground">
                  Seu talento merece ser{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    reconhecido
                  </span>
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg xl:text-xl">
                  Conectamos você a empresas que realmente valorizam a diversidade e estão prontas
                  para oferecer um ambiente de trabalho inclusivo e acolhedor.
                </p>
                <Link to="/cadastro/candidato">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group mt-4"
                  >
                    Cadastre-se Gratuitamente
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Para Empresas */}
      <section className="py-16 lg:py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute left-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimatedSection animation="fade-right" className="order-2 lg:order-1">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white">
                  Construa uma equipe{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    mais diversa
                  </span>
                </h2>
                <p className="text-slate-300 text-base lg:text-lg xl:text-xl">
                  Encontre profissionais qualificados e comprometidos. Empresas diversas são mais
                  inovadoras, produtivas e conectadas com a sociedade.
                </p>
                <Link to="/cadastro/empresa">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group mt-4"
                  >
                    Cadastre sua Empresa
                    <Building2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={200} className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30" />
                <Card className="relative border-0 shadow-2xl overflow-hidden bg-slate-800">
                  <CardContent className="p-8 lg:p-12">
                    <Building2 className="w-12 h-12 lg:w-16 lg:h-16 mb-6 text-purple-400" />
                    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-white">
                      Para Empresas
                    </h3>
                    <p className="text-slate-400 text-base lg:text-lg mb-8">
                      Acesse uma base qualificada de talentos PCD e cumpra suas metas de inclusão
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Banco de talentos qualificados",
                        "Filtros por tipo de deficiência",
                        "Gestão de vagas simplificada",
                        "Relatórios de diversidade",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-sm lg:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="container mx-auto px-4 relative">
          <AnimatedSection animation="scale">
            <Card className="max-w-4xl mx-auto border shadow-2xl overflow-hidden bg-card">
              <CardContent className="p-8 lg:p-16 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl lg:text-2xl xl:text-3xl text-center text-foreground font-medium mb-8 leading-relaxed">
                  "O ConectaPCD mudou minha vida profissional. Em menos de um mês, consegui uma
                  oportunidade incrível em uma empresa que realmente valoriza a inclusão."
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl lg:text-2xl">
                    M
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground text-lg">Maria Silva</div>
                    <div className="text-muted-foreground">Desenvolvedora Full Stack</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 lg:mb-8">
              Pronto para começar sua jornada?
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <p className="text-purple-100 text-lg lg:text-xl xl:text-2xl max-w-2xl mx-auto mb-8 lg:mb-12">
              Junte-se a milhares de pessoas e empresas que estão construindo um mercado de
              trabalho mais inclusivo.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro/candidato">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-purple-700 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Começar como Candidato
                </Button>
              </Link>
              <Link to="/cadastro/empresa">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Cadastrar Empresa
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CSS para animação do gradiente */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
