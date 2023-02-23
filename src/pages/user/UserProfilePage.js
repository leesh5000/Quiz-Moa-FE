import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "../../components/common/Header";
import styled from "styled-components";
import kakao from "../../images/kakao.png";
import palette from "../../lib/styles/palette";
import {getProfile} from "../../lib/api/user";
import Swal from "sweetalert2";
import Spinner from "../../components/common/Spinner";
import Responsive from "../../components/common/Responsive";

const Wrapper = styled(Responsive)`
  color: ${palette.gray[8]};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProfileBlock = styled.div`

  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 1.5rem;
  margin-top: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 1200px) {
    margin: 1rem 1rem 0;
  }

  .title {
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 2px;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${palette.gray[3]};
  }

  .profile {
    height: 300px;
    display: flex;
    justify-content: left;
    align-items: center;

    .img-box {
      width: 300px;
      text-align: center;

      img {
        width: 200px;
        height: 200px;
        border-radius: 0;
        object-fit: cover;

        @media (max-width: 420px) {
          width: 125px;
          height: 125px;
        }
      }
    }

    .info {
      width: 100%;
      margin-left: 3rem;
      margin-right: auto;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 1px;
      color: ${palette.gray[7]};
      word-break: break-all;

      @media (max-width: 420px) {
        margin-left: 1rem;
        font-size: 1rem;
      }

      h3 {
        color: ${palette.gray[9]};
        font-size: 1.5rem;
        margin-right: 1.5rem;

        @media (max-width: 420px) {
          font-size: 1.25rem;
        }
      }

      .email {
        display: flex;
        align-items: center;

        @media (max-width: 420px) {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      .username {
        display: flex;
        align-items: center;

        @media (max-width: 420px) {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      .total-recommend {
        display: flex;
        align-items: center;

        @media (max-width: 420px) {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    }
  }
`;

const HistoryBlock = styled.div`

  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1.5rem;
  
  @media (max-width: 1200px) {
    margin: 1rem;
  }
  
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }
  
  .link {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: ${palette.gray[7]};
    font-weight: 550;
    
    &:hover {
      color: ${palette.cyan[5]};
      text-decoration: underline;
    }
  }
`;

const UserProfilePage = ({user, onLogout}) => {

  console.log('UserProfilePage rendering...');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const email = useParams().email;

  useEffect(() => {

    const getUserProfile = async (email) => {
      try {
        setLoading(true);
        const response = await getProfile(email);
        setProfile(response);
      } catch (e) {
        await Swal.fire({
          icon: 'warning',
          title: '프로필을 불러오는데 실패했습니다.',
        });
        navigate(-1, {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    }

    getUserProfile(email);

  }, [navigate]);

  if (loading) {
    return <Spinner/>;
  }

  if (!profile || !profile.quizzes) {
    return null;
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <Wrapper>
        <ProfileBlock>
          <div className='title'>
            {user.email === profile.email ?
              '내 프로필' : `${profile.username}의 프로필`}
          </div>
          <div className='profile'>
            <div className='img-box'>
              <img src={kakao} alt="kakao"/>
            </div>
            <div className='info'>
              <div className='email'>
                <h3>이메일</h3>
                {profile.email}
              </div>
              <div className='username'>
                <h3>이름</h3>
                {profile.username}
              </div>
              <div className='total-recommend'>
                <h3>받은 총 추천 수</h3> {profile.quizzes.totalVotesSum + profile.answers.totalVotesSum}
              </div>
            </div>
          </div>
        </ProfileBlock>
        <HistoryBlock>
          <div className='title'>
            활동 내역
          </div>
          <Link className='link'
                to={`/users/${profile.email}/quizzes`}
                state={{
                  id: profile.id
                }}>
            {user.email === profile.email ?
              '내 퀴즈 보기' : `${profile.username}의 퀴즈 보기`} {profile.quizzes.totalCount}
          </Link>
          <Link className='link'
                to={`/users/${profile.email}/answers`}
                state={{
                  id: profile.id
                }}>
            {user.email === profile.email ?
              '내 답변 보기' : `${profile.username}의 답변 보기`} {profile.answers.totalCount}
          </Link>
        </HistoryBlock>
      </Wrapper>
    </>
  );
}

export default UserProfilePage;