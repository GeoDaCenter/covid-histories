import type { GetServerSideProps, NextPage } from 'next'
import { getOrCreateUserRecord } from '../api/calls/_s3_utils'
import styles from '../../styles/Home.module.css'
import { prompts } from '../api/calls/_prompts'
import ReactAudioPlayer from 'react-audio-player'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const number = context.params?.id
  const user = await getOrCreateUserRecord(number as string)

  return {
    props: { id: number, user } // will be passed to the page component as props
  }
}

interface CallProps {
  id: string
  user: any
}

function findResponse(
  topic_id: number,
  category_id: number,
  responses: Array<any>
) {
  return responses.find(
    (r: any) => r.topic_id === topic_id && r.category_id === category_id
  )
}

const Call: NextPage<CallProps> = ({ id, user }) => {
  console.log('User response is ', user)
  return (
    <div className={styles.container}>
      <p>Called at {user.created_at}</p>

      {prompts.map((prompt: any, topic_id: number) => (
        <div className="topic" key={topic_id}>
          <h2>{prompt.name}</h2>
          {prompt.categories.map((category: any, category_id: number) => {
            const response = findResponse(topic_id, category_id, user.responses)
            const transcription = findResponse(
              topic_id,
              category_id,
              user.transcriptions
            )
            return (
              <div key={category_id}>
                <h4>{category}</h4>
                {response ? (
                  <>
                    <ReactAudioPlayer src={response.url} controls />
                    <h5>Transcript</h5>
                    {transcription && <p>{transcription.transcription}</p>}
                  </>
                ) : (
                  <p>Did not respond to this question</p>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Call
