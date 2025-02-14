import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import {toast} from "react-toastify"

interface IStatesContext {
    states: IStates[]
    createPost: (postData: IPosts) => Promise<void>
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    modalIsOpen: boolean
    comments: IComments[]
    setComments: React.Dispatch<React.SetStateAction<IComments[]>>
    renderAllPosts:  (stateId: number) => Promise<void>
    setCommentsModalStatus: React.Dispatch<React.SetStateAction<boolean>>
    commentsModalStatus: boolean
}

interface IStatesContextProps {
    children: React.ReactNode;
}

interface IStates {
    name: string
    id: number
    info: string
    img: string
}

interface IPosts {
    id?: string | undefined;
    user: string
    title: string
    comment: string
    img: string
    statesId: number
    avaliation: number
    userId: string 
}

interface IComments {
    title: string
    comment: string
    img: string
    statesId: number
    user: string
    avaliation: number
    userId: string
    id: string
}


export const StatesContext = createContext({} as IStatesContext)

export const StatesProvider = ({ children }: IStatesContextProps) => {

    const [states, setSates] = useState(Array<IStates>)
    const [posts, setPosts] = useState(Array<IPosts>)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [comments, setComments] = useState(Array<IComments>)
    const [commentsModalStatus, setCommentsModalStatus] = useState(false)

    useEffect(() => {
        const RenderStates = async () => {
            try {
                const resposnse = await api.get('/states')
                setSates(resposnse.data)
            } catch (error) {
            }
        }
        RenderStates()
    }, [])

    const createPost = async (postData: IPosts) => {
        const token = localStorage.getItem('@TOKEN')
        try {
            const response = await api.post('/comments', postData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPosts([...posts, response.data])
            toast.success("Comentario criado")
        } catch (error) {
            toast.error("Erro")
        }
    }

    const renderAllPosts = async (stateId:number) => {
        console.log('chamou render all')
        console.log(stateId,typeof stateId, 'stateID é isso ai')
        try {
          const response = await api.get("/comments");
          const filteredComments = response.data.filter((comment: IComments) => comment.statesId === stateId);
          console.log(filteredComments)
          setComments(filteredComments);

          if(filteredComments.length > 0) {
            setCommentsModalStatus(true)
          } else {
            console.log('Esse estado ainda não tem comentários, favor adicione um ~substituir por toast')
          }
        } catch (error) {
          console.log(error);
        }
      };


    return (
        <StatesContext.Provider
            value={{ states, createPost, setModalIsOpen, modalIsOpen, comments, setComments, renderAllPosts, setCommentsModalStatus, commentsModalStatus }}
        >
            {children}

        </StatesContext.Provider>
    );
};