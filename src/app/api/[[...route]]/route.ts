
import { Hono,Context } from 'hono'
import { handle } from 'hono/vercel'
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig, getAuthUser } from "@hono/auth-js"
import authConfig  from "@/auth.config";
import { validator } from 'hono/validator'
import { uploadVideo } from '@/lib/media/upload-video';

//export const runtime = 'edge'


const app = new Hono().basePath('/api')

function getAuthConfig(c: Context): AuthConfig {
    return {
      ...authConfig,
      secret: c.env.AUTH_SECRET,
    };
  }


app.use("*", initAuthConfig(getAuthConfig))


app.post('/upload/video',  validator('form', async (value, c) => {
    const auth = await getAuthUser(c)
    // console.log(value)
    // console.log(auth)
    if(!auth) {
        return c.json({
            error: 'Unauthorized',
        })
    }
    const { lessonId, sectionId, video } = value as { lessonId: string; sectionId: string; video: File };
    const result = await uploadVideo({ lessonId, sectionId, video });
    return c.json(result.data);
}))

export const GET = handle(app)
export const POST = handle(app)

// export default handle(app)