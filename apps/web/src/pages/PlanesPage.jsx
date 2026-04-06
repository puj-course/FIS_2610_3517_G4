import React, { useState } from "react";
import { Helmet } from "react-helmet";
import PublicHeader from "@/components/PublicHeader.jsx";
import LoginModal from "@/components/LoginModal.jsx";
import RegisterModal from "@/components/RegisterModal.jsx";

export default function PlanesPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const planes = [
    {
      name: "Starter",
      price: "$0",
      desc: "Para probar el MVP con funciones básicas.",
      features: ["1 flota demo", "Alertas básicas", "Gestión SOAT (demo)"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      desc: "Para equipos pequeños con operación realista.",
      features: ["Hasta 20 vehículos", "Alertas por vencimiento", "Dashboard y reportes básicos"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "A convenir",
      desc: "Para operaciones grandes y requerimientos avanzados.",
      features: ["Flotas ilimitadas", "Roles y permisos", "Integraciones (futuro)"],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20">
      <Helmet>
        <title>Planes | SYNTIX TECH</title>
      </Helmet>

      <PublicHeader
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-syntix-navy mb-4">Planes</h1>
          <p className="text-lg text-gray-600">
            Elige el plan que mejor se ajuste a tu operación. (Contenido demostrativo para el MVP)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((p) => (
            <div
              key={p.name}
              className={[
                "bg-white rounded-2xl border p-6 shadow-sm flex flex-col",
                p.highlight ? "border-syntix-green shadow-md" : "border-gray-100",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                </div>
                {p.highlight && (
                  <span className="text-xs font-semibold bg-green-50 text-syntix-green px-3 py-1 rounded-full">
                    Recomendado
                  </span>
                )}
              </div>

              <div className="mt-6">
                <div className="text-3xl font-extrabold text-syntix-navy">{p.price}</div>
                <div className="text-xs text-gray-500 mt-1">Precio referencial (demo)</div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-syntix-green" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={[
                  "mt-8 w-full rounded-xl px-4 py-2 font-semibold transition",
                  p.highlight
                    ? "bg-syntix-navy text-white hover:opacity-90"
                    : "bg-gray-100 text-syntix-navy hover:bg-gray-200",
                ].join(" ")}
                onClick={() => setIsRegisterOpen(true)}
              >
                Elegir plan
              </button>
            </div>
          ))}
        </div>
      </section>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}