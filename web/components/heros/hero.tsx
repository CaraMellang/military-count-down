import { NextPage } from "next";
import Image from "next/image";
import { FaEllipsisH } from "react-icons/fa";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import ProjectApi from '../../apis/project.api';
import { useRouter } from 'next/router';

interface HeroProps {
  id?: number;
  backgroundImg?: any;
  title?: string;
  content?: string;
  isCreated?: boolean;
  trickHandler?: () => void;
}

export const Hero: NextPage<HeroProps> = ({ id, backgroundImg, title, content, isCreated, trickHandler }) => {

    const router = useRouter();

    const handleUpdateClick = () => {
      router.push(`/projects/${id}`)
    }

    const handleDeleteClick = () => {
      if (id && trickHandler) {
        ProjectApi.delete(id)
          .then(() => trickHandler());
      }
    }

    const handleMoveToWikiClick = () => {
        router.push(`/projects/wiki/${id}`);
    }

    const canMoveToWiki = () => {
      if (isCreated)
        return null;

      return handleMoveToWikiClick();
    }

    return (
        <div
            className="relative hero rounded-xl shadow-xl transition hover:-translate-y-2 duration-300 cursor-pointer select-none"
            onClick={ canMoveToWiki }
        >
            {
                !isCreated &&
              <div className={"absolute top-0 right-0 p-2 z-50"}>
                  <div
                    className="dropdown dropdown-left"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                  >
                      <label
                        tabIndex={0}
                        className="btn btn-circle btn-ghost btn-sm text-white"
                      >
                          <FaEllipsisH className={'w-4 h-4'} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                          <li>
                              <a onClick={ handleUpdateClick }><AiFillEdit />수정</a>
                          </li>
                          <li>
                              <a onClick={ handleDeleteClick }><AiFillDelete />삭제</a>
                          </li>
                      </ul>
                  </div>
              </div>
            }
            {
                backgroundImg &&
                <Image  priority={true} className={'brightness-50 rounded-xl'} src={ backgroundImg } layout={'fill'} objectFit={'cover'} draggable={false} />
            }
            <div className="hero-overlay bg-opacity-60 rounded-xl shadow-lg"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-full">
                    <h1 className="mb-5 text-5xl font-bold text-stroke-black text-stroke-2">{ title }</h1>
                    <p className="mb-5 text-3xl">{ content }</p>
                    {
                        isCreated ?
                          <p className="mb-5">이미지를 추가하려면 여기를 클릭하세요.</p> :
                          <p className="mb-5">자세한 내용은 여기를 클릭하세요.</p>
                    }
                </div>
            </div>
        </div>
    );
}

export default Hero;