import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { APP_NAME } from '@/constants/app';
import styles from './LoginPage.module.css';

interface Form { email: string; senha: string; }

export default function LoginPage() {
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    nav('/');
  });
  return (
    <div className={styles.wrap}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassCard strong padding="lg" className={styles.card}>
          <div className={styles.logo}><Icon name="building" size={26} /></div>
          <h1>{APP_NAME}</h1>
          <p className={styles.sub}>Gestão de Avanço Físico de Obras</p>
          <form onSubmit={onSubmit} className={styles.form}>
            <label>
              E-mail
              <input type="email" placeholder="voce@construtora.com" {...register('email', { required: true })} />
              {errors.email && <span className={styles.err}>Informe seu e-mail</span>}
            </label>
            <label>
              Senha
              <input type="password" placeholder="••••••••" {...register('senha', { required: true })} />
              {errors.senha && <span className={styles.err}>Informe sua senha</span>}
            </label>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando…' : 'Entrar'}</button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
