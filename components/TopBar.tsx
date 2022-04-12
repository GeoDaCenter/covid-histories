import { useUser } from "@auth0/nextjs-auth0";
import styles from '../styles/Home.module.css'

export const TopBar: React.FC = ()=>{

  const {user} = useUser();
  return(
    <div className={styles.topBar}>
      {user ?
        <>
          <p>Welcome {user.name}</p>
          <a href="/api/auth/logout">logout</a>
        </>
        :
          <a href="/api/auth/login">Login</a>
      }
    </div>
  )
}
