import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext.jsx';

const OVERLAY_PADDING = 12;

const getTargetRect = (targetName) => {
  if (!targetName || typeof document === 'undefined') {
    return null;
  }

  const targetElement = document.querySelector(`[data-onboarding="${targetName}"]`);
  if (!targetElement) {
    return null;
  }

  const rect = targetElement.getBoundingClientRect();
  return {
    top: Math.max(rect.top - OVERLAY_PADDING, 8),
    left: Math.max(rect.left - OVERLAY_PADDING, 8),
    width: rect.width + OVERLAY_PADDING * 2,
    height: rect.height + OVERLAY_PADDING * 2,
  };
};

export default function OnboardingTour() {
  const {
    currentStep,
    currentStepIndex,
    isTourActive,
    showCompletion,
    showWelcome,
    startTour,
    skipWelcome,
    skipTour,
    closeCompletion,
    finishTour,
    goToNextStep,
    goToPreviousStep,
    steps,
  } = useOnboarding();
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isTourActive || !currentStep?.target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const rect = getTargetRect(currentStep.target);
      setTargetRect(rect);

      const targetElement =
        typeof document !== 'undefined'
          ? document.querySelector(`[data-onboarding="${currentStep.target}"]`)
          : null;

      if (targetElement) {
        targetElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };

    const frameId = globalThis.requestAnimationFrame(updateRect);
    globalThis.addEventListener('resize', updateRect);
    globalThis.addEventListener('scroll', updateRect, true);

    return () => {
      globalThis.cancelAnimationFrame(frameId);
      globalThis.removeEventListener('resize', updateRect);
      globalThis.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep, isTourActive]);

  const progressPercentage = useMemo(() => {
    if (!steps.length) {
      return 0;
    }

    return Math.round(((currentStepIndex + 1) / steps.length) * 100);
  }, [currentStepIndex, steps.length]);

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-syntix-green/10 text-syntix-green">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-syntix-navy">Bienvenido a Drive Control</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Detectamos que tu cuenta acaba de completar el ingreso inicial. Si quieres, te guiamos por el
            dashboard, las alertas, reportes, validacion RUNT, configuracion y el flujo para agregar tu
            primer vehiculo. Si ya entendiste la plataforma, puedes omitir este paso y entrar de una vez.
          </p>

          <div className="mt-6 rounded-2xl border border-syntix-green/20 bg-syntix-green/5 p-4 text-sm text-gray-700">
            El recorrido solo aparece automaticamente para cuentas nuevas. Luego podras volver a abrirlo
            manualmente desde el encabezado del dashboard cuando quieras repasarlo.
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-syntix-navy">Qué vas a recorrer</p>
              <ul className="mt-2 space-y-1">
                <li>• Dashboard y accesos rápidos</li>
                <li>• Vehículos, conductores y documentos</li>
                <li>• Alertas, RUNT e historial</li>
                <li>• Reportes y configuración</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-syntix-navy">Qué lograrás al final</p>
              <ul className="mt-2 space-y-1">
                <li>• Entender la navegación completa</li>
                <li>• Saber dónde registrar información</li>
                <li>• Detectar dónde revisar riesgos y evidencias</li>
                <li>• Ubicar ajustes y respaldos del sistema</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={skipWelcome}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Ya entendi, ir al inicio
            </button>
            <button
              type="button"
              onClick={startTour}
              className="rounded-xl bg-syntix-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-syntix-navy/90"
            >
              Si, mostrar tutorial
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isTourActive || !currentStep) {
    if (showCompletion) {
      return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-syntix-green/10 text-syntix-green">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-syntix-navy">Todo listo para comenzar</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Ya recorriste los puntos principales de Drive Control. Desde este momento puedes usar el
              dashboard como centro de trabajo y moverte con más seguridad por vehículos, documentos,
              alertas, RUNT, reportes y configuración.
            </p>

            <div className="mt-6 rounded-2xl border border-syntix-green/20 bg-syntix-green/5 p-4 text-sm text-gray-700">
              Tu cuenta ya quedó preparada para empezar a operar el software con una vista clara de dónde
              registrar información, dónde revisar riesgos y dónde hacer seguimiento.
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={closeCompletion}
                className="rounded-xl bg-syntix-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-syntix-navy/90"
              >
                Ir al dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] pointer-events-auto">
      <div className="absolute inset-0 bg-slate-950/45" />

      {targetRect && (
        <div
          className="absolute rounded-3xl border-2 border-syntix-green shadow-[0_0_0_9999px_rgba(15,23,42,0.35)] transition-all duration-300"
          style={targetRect}
        />
      )}

      <div className="absolute bottom-4 right-4 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-syntix-green/10 px-3 py-1 text-xs font-semibold text-syntix-green">
              <Sparkles className="h-4 w-4" />
              Paso {currentStepIndex + 1} de {steps.length}
            </div>
            <h3 className="mt-3 text-lg font-bold text-syntix-navy">{currentStep.title}</h3>
          </div>

          <button
            type="button"
            onClick={skipTour}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Saltar tutorial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">{currentStep.description}</p>

        {Array.isArray(currentStep.learnings) && currentStep.learnings.length > 0 && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">En esta parte te guiamos por</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {currentStep.learnings.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-syntix-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-syntix-green transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Atras
            </button>

            <button
              type="button"
              onClick={skipTour}
              className="rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
            >
              Ya entendi
            </button>
          </div>

          {currentStepIndex === steps.length - 1 ? (
            <button
              type="button"
              onClick={finishTour}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-syntix-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-syntix-green/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              Finalizar
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextStep}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-syntix-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-syntix-navy/90"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
