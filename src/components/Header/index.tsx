import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR' //importando o ptBR
import styles from './styles.module.scss'

export function Header() {
  const currentData = format(new Date(),'EEEEEE, d MMMM', {
  
  locale:ptBR,
  })
return(
  <header className={styles.HeaderContainer}>
    <img src="/logo.svg" alt="podcastr" />
    <p>O melhor para você ouvir, sempre</p>
    <span>{currentData}</span>
  </header>
);
}