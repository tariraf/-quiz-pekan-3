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
  } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function ConfirmationModal({id}) {
    const {state} = useGlobalContext()
    const {isConfirmed, closeConfirmation, setId} = state
    const [title, setTitle] = useState('')
    const { mutate, isLoading, isError } = useMutation();
    const selectedId = id;
    const route = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/notes/${id}`);
                const result = await response.json();
                setTitle(result?.data?.title)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async (event) => {
        event.preventDefault()

        const id = event.target.value
        const result = await mutate({url: `/api/notes/delete/${selectedId}`, method : 'DELETE'})
        console.log(id)
        if (result?.success) {
            console.log('Notes deleted successfully:', result)
            route.reload()
        }
    }

    return(
        <Modal isOpen={isConfirmed} onClose={() => {
            setId('');
            closeConfirmation()
        }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete "{title}"</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this note?</Text>
          </ModalBody>

          <ModalFooter>
            <Button backgroundColor='#7F1D1D' color='white' mr={3} onClick={(e) => {
                e.preventDefault()
                setId('');
                closeConfirmation()
            }}>
              Cancel
            </Button>
            <Button variant='ghost' onClick={handleDelete} color='#7F1D1D'>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}