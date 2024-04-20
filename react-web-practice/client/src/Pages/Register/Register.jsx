import './Register.css'
import { VStack, ButtonGroup, FormControl, FormLabel, Button, FormErrorMessage, Input, Heading } from "@chakra-ui/react"
import * as Yup from "yup";
import { Formik } from 'formik'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.post('http://localhost:4000/register', values);
      
      if (response.status === 201) {
        navigate("/");
      } else {
        throw new Error("Ошибка при регистрации");
      }
    } catch (error) {
      setError(error.message);
    }
  };

    return (
      <Formik 
      initialValues={{ fullname: "", birth: "", phone: "", depart: "", rating: 0, password: "", ondeck: false}}
      validationSchema={Yup.object({
        fullname: Yup.string().required("Напишите ФИО").min(2, "ФИО слищком короткое"),
        birth: Yup.string()
          .required("Заполните поле: Пример заполнения 01.01.1000")
          .matches(/^\d{2}\.\d{2}\.\d{4}$/, "Неверный формат даты. Пример заполнения: 01.01.1000"),
        phone: Yup.string().required("Заполните поле: Пример заполнения +79010010100").min(12, "Телефон слмшком короткий").max(12, "Телефон слишком длинный"),
        depart: Yup.string().required("Заполните поле: Название вашего отдела"),
        password: Yup.string().required("Заполните поле").min(6, "Пароль должен содержать минимум 6 символов"),
      })}
      onSubmit={handleSubmit}>

        {(formik) => (
        <VStack as="form" w={{base: "50%", md: "500px"}} m="auto" justify="center" h="80vh">
        <Heading>РЕГИСТАЦИЯ</Heading>
        <FormControl isInvalid={formik.errors.fullname && formik.touched.fullname}>
          <FormLabel>Полное имя пользователя</FormLabel>
          <Input name="fullname" placeholder="Введите ФИО" autoComplete="off" {...formik.getFieldProps("fullname")}/>
          <FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.birth && formik.touched.birth}>
          <FormLabel>Дата рожения</FormLabel>
          <Input name="birth" placeholder="Дата рождения" autoComplete="off" {...formik.getFieldProps("birth")}/>
          <FormErrorMessage>{formik.errors.birth}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.phone && formik.touched.phone}>
          <FormLabel>Введите номер телефона</FormLabel>
          <Input name="phone" placeholder="Телефон" autoComplete="off" {...formik.getFieldProps("phone")}/>
          <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.depart && formik.touched.depart}>
          <FormLabel>Отдел</FormLabel>
          <Input name="depart" placeholder="Введите название отдела" autoComplete="off" {...formik.getFieldProps("depart")}/>
          <FormErrorMessage>{formik.errors.depart}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.password && formik.touched.password}>
        <FormLabel>Пароль</FormLabel>
          <Input name="password" placeholder="Придумайте пароль" type='password' autoComplete="off" {...formik.getFieldProps("password")}/>
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>

        <ButtonGroup pt="1rem">
          <Button type="submit" onClick={formik.handleSubmit}>Создать аккаунт</Button>
          <Button onClick={() => navigate("/")}>Назад</Button>
        </ButtonGroup>
      </VStack>)}
      
      </Formik>
    );
  };
  
  export default Register;