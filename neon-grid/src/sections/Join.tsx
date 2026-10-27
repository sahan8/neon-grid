import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { images } from '../data/content';
import { SceneShell } from '../three/SceneShell';
import { Button, ArrowIcon, Checkbox, Input, Select } from '../components/ui';
import { scrollToId } from '../lib/boot';
import { useReducedMotion } from '../hooks/useReducedMotion';

const loadTunnel = () => import('../three/DataTunnel');

const schema = z.object({
  handle: z
    .string()
    .trim()
    .min(3, 'ERR_411 // HANDLE TOO SHORT — MIN 3 CHARS')
    .max(20, 'ERR_413 // HANDLE TOO LONG — MAX 20 CHARS')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'ERR_415 // LETTERS, NUMBERS, _ . - ONLY'),
  email: z.string().trim().email('ERR_422 // INVALID EMAIL — expected user@domain.net'),
  faction: z.enum(['netrunner', 'corpo', 'nomad', 'street'], { errorMap: () => ({ message: 'ERR_400 // CHOOSE A FACTION TO ROUTE YOUR LINK' }) }),
  updates: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

const FACTIONS = [
  { value: 'netrunner', label: 'Netrunner' },
  { value: 'corpo', label: 'Corpo' },
  { value: 'nomad', label: 'Nomad' },
  { value: 'street', label: 'Street' },
];

type Phase = 'idle' | 'loading' | 'success';

/** Replace with your real endpoint (Formspree, Resend, a Vercel function…). */
async function submitToBackend(values: FormValues) {
  await new Promise((r) => setTimeout(r, 1600));
  return { runner: String(4217 + Math.floor(Math.random() * 90)).padStart(5, '0'), values };
}

function Confetti() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const colors = ['#00F0FF', '#FF2A6D', '#F5E642', '#2BFF88', '#7B2CFF', '#E8F1FF'];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 48 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute top-0 h-2 w-2"
          style={{ left: `${(i * 37) % 100}%`, background: colors[i % colors.length], boxShadow: `0 0 6px ${colors[i % colors.length]}` }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: 520, opacity: 0, rotate: 180 }}
          transition={{ duration: 1.6 + (i % 5) * 0.3, delay: (i % 8) * 0.06, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export function Join() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<{ runner: string; values: FormValues } | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, submitCount },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { updates: true } });

  const handle = watch('handle');
  const errCount = Object.keys(errors).length;
  const status = phase === 'loading' ? 'CONNECTING' : phase === 'success' ? 'ONLINE' : errCount && submitCount ? 'REJECTED' : 'IDLE';
  const statusColor = status === 'REJECTED' ? '#FF3B3B' : status === 'ONLINE' ? '#2BFF88' : status === 'CONNECTING' ? '#F5E642' : '#8A93A8';

  const onSubmit = async (values: FormValues) => {
    setPhase('loading');
    try {
      setResult(await submitToBackend(values));
      setPhase('success');
    } catch {
      setPhase('idle');
    }
  };

  const log =
    phase === 'loading'
      ? [['> HANDSHAKE ............ OK', '#2BFF88'], ['> ROUTING VIA NODE 07 .. OK', '#2BFF88'], ['> ESTABLISHING LINK...', '#E8F1FF']]
      : errCount && submitCount
        ? [['> NEON//GRID ACCESS TERMINAL v2.0', '#8A93A8'], [`> CONNECT FAILED · ${errCount} FIELD(S) REJECTED`, '#FF3B3B']]
        : handle
          ? [['> NEON//GRID ACCESS TERMINAL v2.0', '#8A93A8'], [`> CHECKING HANDLE "${handle.toUpperCase()}"`, '#E8F1FF']]
          : [['> NEON//GRID ACCESS TERMINAL v2.0', '#8A93A8'], ['> ENTER CREDENTIALS TO JACK IN', '#E8F1FF']];

  return (
    <section id="join" aria-labelledby="join-title" className="relative overflow-hidden bg-void py-20 md:py-28">
      <SceneShell
        load={loadTunnel}
        props={{}}
        className="absolute inset-0 opacity-70"
        fallback={<img src={images.loaderBg} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover opacity-60" />}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-void/30" />

      <div className="container-grid relative grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] text-cyan">06 / JACK IN</span>
          <h2 id="join-title" className="glitch mt-4 text-h2 font-black" data-text="Join the grid">
            Join the grid
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-muted">Claim your handle before someone else does. Early runners get first access to every district drop.</p>
          <ul className="mt-6 flex flex-col gap-2">
            {['Early access to new districts', 'Exclusive augment drops', 'Crew comms + faction events'].map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="font-mono text-cyan">[+]</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="glass relative overflow-hidden transition-shadow duration-base"
          style={{
            borderColor: phase === 'success' ? '#2BFF88' : errCount && submitCount ? 'rgba(255,59,59,.7)' : undefined,
            boxShadow: phase === 'success' ? '0 0 32px rgba(43,255,136,.25)' : errCount && submitCount ? '0 0 24px rgba(255,59,59,.25)' : '0 0 24px rgba(0,240,255,.15)',
          }}
        >
          <div className="flex h-9 items-center justify-between border-b border-line px-4 font-mono text-[11px] tracking-[0.14em] text-ink-muted">
            <span>jack_in.sh — tty07</span>
            <span style={{ color: statusColor }}>● {status}</span>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'success' && result ? (
              <motion.div key="ok" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex min-h-[460px] flex-col justify-center gap-4 p-6 md:p-10">
                <Confetti />
                <span className="font-mono text-xs tracking-[0.2em] text-success">LINK ESTABLISHED · 200 OK</span>
                <p className="font-display text-2xl font-black md:text-3xl">
                  Welcome to the grid,
                  <br />
                  <span className="text-cyan" style={{ textShadow: '0 0 12px #00F0FF' }}>
                    {result.values.handle.toUpperCase()}
                  </span>
                </p>
                <p className="text-ink-muted">Your link is live. An access key is on its way to {result.values.email}.</p>
                <p className="hud-label">
                  FACTION · <span className="text-ink">{result.values.faction.toUpperCase()}</span> · RUNNER #{result.runner}
                </p>
                <Button onClick={() => scrollToId('top')} icon={<ArrowIcon />} className="self-start">
                  Enter the grid
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 p-6 md:p-8" aria-describedby="join-log">
                <div id="join-log" role="log" aria-live="polite" className="font-mono text-xs leading-6">
                  {log.map(([t, c], i) => (
                    <div key={t} style={{ color: c }}>
                      {t}
                      {i === log.length - 1 && phase !== 'loading' && <span className="caret ml-1" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
                <Input label="HANDLE" placeholder="v1per" autoComplete="nickname" error={errors.handle?.message} {...register('handle')} />
                <Input label="EMAIL" type="email" placeholder="you@grid.net" autoComplete="email" inputMode="email" error={errors.email?.message} {...register('email')} />
                <Select label="FACTION" placeholder="Select faction…" options={FACTIONS} error={errors.faction?.message} {...register('faction')} />
                <Checkbox label="Send me transmissions — drops, events, lore" {...register('updates')} />
                <Button type="submit" disabled={phase === 'loading'} className="w-full" icon={phase === 'loading' ? undefined : <ArrowIcon />}>
                  {phase === 'loading' ? 'Establishing link...' : 'Connect'}
                </Button>
                <p className="text-center text-sm text-ink-muted">
                  By connecting you accept the <a href="#" className="text-cyan underline-offset-4 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-cyan underline-offset-4 hover:underline">Privacy Policy</a>.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
