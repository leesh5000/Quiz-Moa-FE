import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "../../components/common/Header";
import styled from "styled-components";
import palette from "../../lib/styles/palette";
import {deleteUser, getProfile, updateUsername} from "../../lib/api/user";
import Swal from "sweetalert2";
import Spinner from "../../components/common/Spinner";
import Responsive from "../../components/common/Responsive";
import person from "../../images/person.png";
import Button from "../../components/common/Button";

const Wrapper = styled(Responsive)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 2px;
    padding-bottom: 1rem;
    color: ${palette.gray[9]};
    border-bottom: 1px solid ${palette.gray[3]};
  }
`;

const ProfileBlock = styled.div`

  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 1.5rem;
  margin-top: 3rem;
  background-color: ${palette.gray[0]};

  @media (max-width: 1200px) {
    margin: 1rem 1rem;
  }

  .profile {
    padding-top: 1.5rem;
    display: flex;
    justify-content: left;
    align-items: center;

    .img-box {
      width: 300px;
      text-align: center;

      img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 100%;
        opacity: 0.7;

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
      font-size: 1.125rem;
      letter-spacing: 1px;
      color: ${palette.gray[7]};
      word-break: break-all;

      @media (max-width: 420px) {
        margin-left: 1rem;
        font-size: 1rem;
      }

      h3 {
        color: ${palette.gray[8]};
        font-size: 1.25rem;
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
        
        .edit-button {
          font-size: 1.125rem;
          font-weight: 600;
          margin-left: 1rem;
          cursor: pointer;
          color: ${palette.blue[6]};
          &:hover {
            color: ${palette.blue[2]};
            text-decoration: underline;
          }

          @media (max-width: 420px) {
            margin: 0;
          }
        }

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
  padding: 1.5rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
  background-color: ${palette.gray[0]};
  
  @media (max-width: 1200px) {
    margin: 1rem;
  }
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  .link {
    margin-top: 1.5rem;
    padding-right: 0;
    font-size: 1.25rem;
    color: ${palette.gray[8]};
    font-weight: 400;
    
    &:hover {
      color: ${palette.cyan[4]};
      text-decoration: underline;
    }
  }
`;

const UsernameInput = styled.input`
  border: 1px solid ${palette.gray[6]};
  height: 2.125rem;
  width: 320px;
  font-size: 1.25rem;
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ButtonBlock = styled.div`
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background-color: ${palette.gray[0]};
  
  .description {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    color: ${palette.gray[7]};
    margin-top: 1.5rem;
  }

  @media (max-width: 1200px) {
    margin: 1rem;
  }
`;

const StyledButton = styled(Button)`
  background-color: ${palette.red[6]};
  &:hover {
    background-color: ${palette.red[3]};
  }
  height: 2rem;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.5rem;
`;


const UserProfilePage = ({user, onLogout}) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const userId = Number(useParams().id);
  let username = '';

  useEffect(() => {

    const getUserProfile = async (userId) => {
      try {
        setLoading(true);
        const response = await getProfile(userId);
        setProfile(response);
      } catch (e) {
        await Swal.fire({
          icon: 'warning',
          title: '프로필을 불러오는데 실패했습니다.',
        });
        throw e;
      } finally {
        setLoading(false);
      }
    }

    getUserProfile(userId)
      .catch(e => {
        console.log(e);
        navigate('-1', {
          replace: true,
        });
      });

  }, [navigate]);

  const onEdit = () => {

    if (edit) {
      const update = async () => {
        try {
          setLoading(true);
          await updateUsername(user.id, {value: username});
        } catch (e) {
          await Swal.fire({
            icon: 'warning',
            title: '프로필을 수정하는데 실패했습니다.',
          });
        } finally {
          setLoading(false);
        }
      }

      if (!username) {
        Swal.fire({
          icon: 'warning',
          title: '이름을 입력해주세요.',
        });
        return;
      }

      if (username.length < 2 || username.length > 20) {
        Swal.fire({
          icon: 'warning',
          title: '이름은 2자 이상 20자 이하로 입력해주세요.',
        });
        return;
      }

      // 수정 후 이름이 수정 전 이름과 같으면 그냥 Return
      if (username === profile.username) {
        return;
      }

      update()
        .then(() => {
          setProfile({
            ...profile,
            username,
          });
          localStorage.setItem('username', username);
        });
    }

    setEdit(!edit);
  }

  const onDeletion = () => {
    Swal.fire({
      title: '회원 탈퇴',
      text: '정말로 탈퇴하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await deleteUser(user.id);
          localStorage.clear();
          navigate('/', {
            replace: true,
          });
        } catch (e) {
          await Swal.fire({
            icon: 'warning',
            title: '잠시 후 다시 시도해주세요.',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  }

  if (loading) {
    return <Spinner/>;
  }

  if (!profile) {
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
              <img src={person} alt="userImage"/>
            </div>
            <div className='info'>
              {user.id === profile.id && (
                <div className='email'>
                  <h3>이메일</h3>
                  {profile.email}
                </div>
              )}
              <div className='username'>
                <h3>이름</h3>
                <div className='name'>
                  {edit ?
                    <UsernameInput type="text"
                                   defaultValue={profile.username}
                                   onChange={(e) => {
                                     username = e.target.value;
                                   }}/>
                    : profile.username}
                </div>
                {(user.id === userId) && (
                  <div className='edit-button'
                       onClick={onEdit}>
                    {edit ? '저장' : '수정'}
                  </div>
                )}
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
                to={`/users/${profile.id}/quizzes`}
                state={{
                  id: profile.id
                }}>
            {user.email === profile.email ?
              '내 퀴즈 보기' : `${profile.username}의 퀴즈 보기`} {profile.quizzes.totalCount}
          </Link>
          <Link className='link'
                to={`/users/${profile.id}/answers`}
                state={{
                  id: profile.id
                }}>
            {user.email === profile.email ?
              '내 답변 보기' : `${profile.username}의 답변 보기`} {profile.answers.totalCount}
          </Link>
        </HistoryBlock>
        {(user.id === userId) && (
          <ButtonBlock>
            <div className='title'>
              회원 탈퇴
            </div>
            <div className='description'>
              탈퇴 시 작성한 모든 퀴즈와 답변 정보는 삭제됩니다.
            </div>
            <StyledButton onClick={onDeletion}>
              회원 탈퇴
            </StyledButton>
          </ButtonBlock>
        )}
      </Wrapper>
    </>
  );
}

export default UserProfilePage;