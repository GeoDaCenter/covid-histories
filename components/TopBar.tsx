import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import styles from '../styles/Home.module.css'

export const TopBar: React.FC = ()=>{

  const {user} = useUser();
  return(
    <div className={styles.topBar}>
      {user ?
        <>
          <p>Welcome {user.name}</p>
          <Link href="/api/auth/logout">logout</Link>
        </>
        :
          <Link href="/api/auth/login">Login</Link>
      }
    </div>
  )
}
