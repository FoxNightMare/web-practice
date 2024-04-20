import './Login.css';
import { useState } from 'react';
import { VStack, ButtonGroup, FormControl, FormLabel, Button, FormErrorMessage, Input, Heading } from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik } from 'formik'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Componets/UserContext/UserContext'; 
import axios from 'axios'; // Импортируем Axios

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser(); 
  const [error, setError] = useState(null);

  const getUserDataFromDatabase = async (values) => {
    try {
      const response = await axios.post('http://localhost:4000/login', values); // Отправляем POST запрос на сервер

      if (response.status === 200) {
        return response.data; // Возвращаем данные пользователя, если запрос успешен
      } else {
        throw new Error("Пользователь c такими данными не найден");
      }
    } catch (error) {
      throw new Error("Произошла ошибка при обработке запроса");
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      const userData = await getUserDataFromDatabase(values);

      loginUser(userData); 
      navigate("/Home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Formik 
      initialValues={{ fullname: "", password: "" }}
      validationSchema={Yup.object({
        fullname: Yup.string().required("Неверное имя").min(2, "Имя слишком короткое"),
        password: Yup.string().required("Неверный пароль").min(6, "Пароль должен содержать минимум 6 символов"),
      })}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <VStack as="form" w={{base: "50%", md: "500px"}} m="auto" justify="center" h="80vh">
          <Heading>ВХОД</Heading>
          <FormControl isInvalid={formik.errors.fullname && formik.touched.fullname}>
            <FormLabel>Полное имя пользователя</FormLabel>
            <Input name="fullname" placeholder="Введите ФИО" autoComplete="off" {...formik.getFieldProps("fullname")}/>
            <FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formik.errors.password && formik.touched.password}>
            <FormLabel>Пароль</FormLabel>
            <Input name="password" placeholder="Введите пароль" type='password' autoComplete="off" {...formik.getFieldProps("password")}/>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>

          {error && <FormErrorMessage>{error}</FormErrorMessage>}

          <ButtonGroup pt="1rem">
            <Button type="submit" onClick={formik.handleSubmit}>Вход</Button>
            <Button onClick={() => navigate("/register")}>Создать учетную запись</Button>
          </ButtonGroup>
        </VStack>
      )}
    </Formik>
  );
};

export default Login;