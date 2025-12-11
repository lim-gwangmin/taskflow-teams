import { getProfile } from "@/lib/fetching/profile";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  try {
    const getUser = await getProfile();
    const { data, error } = getUser;

    if (error) {
      console.error(error.message);
      throw Error(error.message);
    }

    const { name, email, nickname, discriminator } = data.result;

    return (
      <div>
        <section>
          <h4>이름: {name}</h4>
        </section>
        <section>
          <h4>이메일: {email}</h4>
        </section>
        <section>
          <h4>닉네임: {nickname + "#" + discriminator}</h4>
        </section>
      </div>
    );
  } catch (error) {
    console.error("profilePage error: ", error);
    notFound();
  }

  return <>오류가 발생했습니다.</>;
}
