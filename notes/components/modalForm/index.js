import { useGlobalContext } from '@/context/global';
import { useMutation } from '@/hooks/useMutation';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Input,
    Textarea,
    Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ModalForm({ id }) {
    const { state, handleFunction } = useGlobalContext();
    const { isModalOpen, setId } = state;
    const { closeModal } = handleFunction;
    const [input, setInput] = useState({
        title: "",
        description: ""
    });
    const [fetchedData, setFetchedData] = useState({
        title: "",
        description: ""
    });
    const route = useRouter();
    const { mutate, isLoading, isError } = useMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/notes/${id}`);
                const result = await response.json();
                setFetchedData({
                    title: result?.data?.title || "",
                    description: result?.data?.description || ""
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        setInput({
            title: fetchedData.title,
            description: fetchedData.description
        });
    }, [fetchedData]);

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setInput({ ...input, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(input)
        if (!id) {
            const result = await mutate({ url: '/api/notes/add', payload: input });

            if (result?.success) {
                console.log('Notes added successfully:', result)
                route.reload()
            } 
        } else {
            const result = await mutate({url: `/api/notes/update/${id}`, method : 'PATCH', payload : input})
        
            if (result?.success) {
                console.log('Notes edited successfully:', result)
                route.reload()
            }
        }
    }

    return (
        <Modal isOpen={isModalOpen} onClose={(e) => { setId(undefined); closeModal(); }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{!id ? 'Add Note' : 'Edit Note'}</ModalHeader>
                <ModalCloseButton />
                {isLoading ? (
                    <div className='flex justify-center'>
                        <Spinner size='xl' />
                    </div>
                ) : (
                    <ModalBody>
                        <Input
                            variant='flushed'
                            placeholder='Title'
                            fontSize='xl'
                            paddingX={3}
                            name='title'
                            onChange={handleChange}
                            value={input.title}
                        />
                        <Textarea
                            mt={5}
                            placeholder='Description'
                            fontSize='lg'
                            name='description'
                            onChange={handleChange}
                            value={input.description}
                        />
                    </ModalBody>
                )}
                <ModalFooter>
                    <Button backgroundColor='#7F1D1D' color='white' mr={3} onClick={handleSubmit}>
                        {!id ? 'Add Note' : 'Save Edit'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
