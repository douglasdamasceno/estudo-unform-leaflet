import { useRef } from "react";
import { Form } from "@unform/web";
import { Scope } from "@unform/core";
import * as Yup from "yup";
import "../App.css"

import Input from "../components/Form/Input";
import InputMask from "../components/Form/InputMask";
import Select from "../components/Form/Select";
import Radio from "../components/Form/Radio";


const optionsSelect = [
  { value: "Finalizada", label: "Finalizada" },
  { value: "Em andamento", label: "Em andamento" },
];
const optionsRadio = [
  { id: "Tem forças amigas", label: "Tem forças amigas" },
  { id: "Não Tem forças amigas", label: "Não Tem forças amigas" }
];


function FormApp() {

  const formRef = useRef(null);

  async function getAddressByZipcode() {
    let zipcode = formRef.current.getData().address.zipcode;
    if (zipcode.match("[0-9]{5}-[0-9]{3}") !== null) {
      fetch(`https://api.pagar.me/1/zipcodes/${zipcode}`)
        .then(response => response.json())
        .then(data => {
          if (data !== undefined && !data.errors) {
            const { state, neighborhood, street, city } = data;
            formRef.current.setFieldValue('address.state', state);
            formRef.current.setFieldValue('address.neighborhood', neighborhood);
            formRef.current.setFieldValue('address.street', street);
            formRef.current.setFieldValue('address.city', city);
          }
        }
      );
    }
  }
  async function handleSubmit(data, { reset }) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("O nome é obrigatório"),
        date: Yup.string().required("A data é obrigatório"),
        hour: Yup.string().required("A hora é obrigatório"),
        status: Yup.string().required("O status é obrigatório"),
        friendlyForces: Yup.string().required("Informe uma opção").nullable(),
        address: Yup.object().shape({
          zipcode: Yup.string().required("CEP é obrigatório").max(9),
          city: Yup.string().required("Cidade é obrigatório"),
          state: Yup.string().required("Estado é obrigatório"),
          street: Yup.string().required("Rua é obrigatório"),
          neighborhood: Yup.string().required("Bairro é obrigatório"),
          streetNumber: Yup.string().required("Número é obrigatório"),
          complement: Yup.string().required("Complemento é obrigatório"),
        })
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      console.log(data);
      formRef.current.setErrors({});
      reset();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages = {};
        error.inner.forEach(err => {
          errorMessages[err.path] = err.message;
        })
        formRef.current.setErrors(errorMessages);
      }
    }
  }

  return (
    <div className="container">
      <h3 className="title-page">Cadastrar Operação</h3>
      <Form ref={formRef} className="my-form" onSubmit={handleSubmit}>
        <div className="container-input input-name">
          <Input
            className="my-input"
            label="Nome"
            name="name"
          />
        </div>
        <div className="container-input input-select">
          <Select
            className="my-select"
            name="status"
            label="Status"
            options={optionsSelect}
          >
            {optionsSelect.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="container-radio container-input">
          <Radio
            className="input-radio"
            name="friendlyForces"
            options={optionsRadio}
          />
        </div>
        <div className="container-input">
          <Input
            mask='99/99/9999'
            className="input-date"
            type="date"
            label="Data"
            min="2017-04-01"
            name="date"
          />
        </div>
        <div className="container-input">
          <InputMask
            mask='99:99'
            className="input-hours"
            //type="time"
            label="Hora"
            name="hour"
          />
        </div>
        <Scope path="address">
          <div className="container-input input-zipcode">
            <InputMask
              mask='99999-999'
              label="CEP"
              className="my-input"
              onBlur={() => getAddressByZipcode()}
              name="zipcode"
            />
          </div>
          <div className="container-input input-state">
            <Input
              label="Estado"
              className="my-input"
              name="state"
            />
          </div>
          <div className="container-input input-city">
            <Input
              label="Cidade"
              className="my-input"
              name="city"
            />
          </div>
          <div className="container-input input-neighborhood">
            <Input
              label="Bairro"
              className="my-input"
              name="neighborhood"
            />
          </div>
          <div className="container-input input-street">
            <Input
              label="Rua"
              className="my-input"
              name="street"
            />
          </div>
          <div className="container-input input-street-number">
            <Input
              label="Número"
              className="my-input"
              name="streetNumber"
            />
          </div>
          <div className="container-input input-complement">
            <Input
              label="Complemento"
              className="my-input"
              name="complement"
            />
          </div>
        </Scope>
        <button className="btn-primary" type="submit">Salvar</button>
      </Form>
    </div>
  )
}

export default FormApp
