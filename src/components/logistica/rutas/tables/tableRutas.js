import TableRowClick from 'components/common/advance-table/TableRowClick';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner, Card, Offcanvas } from 'react-bootstrap';
import SubtleBadge from 'components/common/SubtleBadge';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faPaperPlane, faCheck, faStream, faPen, faBan, faSpinner } from '@fortawesome/free-solid-svg-icons'; 
import { useNewRuta } from '../../../../hooks/Logistica/Ruta/useRutas';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AllReservasHeader from './AllReservasHeader'
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import PropTypes from 'prop-types';
import { useBreakpoints } from 'hooks/useBreakpoints';
import ReservaFilterForm from '../sections/ReservasFilterForm'
import Flex from 'components/common/Flex';
import Avatar from 'components/common/Avatar';


const PrioritySelect = ({ title, color, data, className, style }) => {
    return (
      <div
        style={style}
        className={classNames('d-flex align-items-center gap-2', className)}
      >
        <div style={{ '--falcon-circle-progress-bar': data }}>
          <svg
            className="circle-progress-svg"
            width="26"
            height="26"
            viewBox="0 0 120 120"
          >
            <circle
              className="progress-bar-rail"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeLinecap="round"
              strokeWidth="12"
            ></circle>
            <circle
              className="progress-bar-top"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeLinecap="round"
              stroke={color}
              strokeWidth="12"
            ></circle>
          </svg>
        </div>
        <h6 className="mb-0 text-700">{title}</h6>
      </div>
    );
};

PrioritySelect.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
  
const columns = [
  {
    accessor: 'vehiculo',
    Header: 'Vehiculo',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'folio',
    Header: 'Folio',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'fechaSalida',
    Header: 'Fecha Inicio',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'horario',
    Header: 'Horario',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'ruta',
    Header: 'Ruta',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'equipo',
    Header: 'Equipo',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'plazasDisp',
    Header: 'Plazas Disponibles',
    headerProps: { className: 'text-900' },
    cellProps: {
        className: 'py-2 pe-4'
    }
  },
  {
    accessor: 'estatus',
    Header: 'Estatus',
    headerProps: { className: 'text-900' },
    cellProps: { className: 'text-center py-2 pe-4' }
  },
  {
    accessor: 'priority',
    Header: 'Situacion',
    headerProps: { className: 'text-900' },
    cellProps: {
      className: 'pe-4'
    },
    Cell: rowData => {
      const { priority } = rowData.row.original;
      return (
        <PrioritySelect
          title={priority.title}
          color={priority.color}
          data={priority.data}
        />
      );
    }
  },
  {
    accessor: 'User',
    Header: 'Usuario',
    headerProps: { className: 'ps-2 text-900', style: { height: '46px' } },
    cellProps: {
      className: 'py-2 white-space-nowrap pe-3 pe-xxl-4 ps-2'
    },
    Cell: rowData => {
        const { User, avatar } = rowData.row.original;
        return (
          <Flex alignItems="center" className="position-relative py-1">
            {avatar && avatar.img ? (
              <Avatar src={avatar.img} size="xl" className="me-2" />
            ) : (
              <Avatar size="xl" name={avatar ? avatar.name : User} className="me-2" />
            )}
            <h6 className="mb-0">
                <Link
                to="#"
                className="stretched-link text-900"
                onClick={(e) => e.stopPropagation()}
                >
                    {User}
                </Link>
            </h6>
          </Flex>
        );
    }
  }
  
];

function TableRutas({ruta, movimientos, estatus, layout, setFilter, situaciones, usuarios, filter }) {

  const [result, setResult] = useState([]);
  const [formToShow, setFormToShow] = useState('');
  const { newRuta, result: response, isLoading } = useNewRuta();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const { breakpoints } = useBreakpoints();


  useEffect(() => {
    if (ruta && ruta.status === 200 && ruta.data.length > 0) 
    {
      const transformedData = ruta.data.map(u => ({
        User: u.Usuario,
        avatar: {
            name: u.Usuario,
            size: 'xl',
            round: 'circle'
        },
        folio: `${u.Folio}`,
        fechaSalida: u.FechaSalida,
        estatus: (
          <SubtleBadge pill           
            bg={classNames({
            success:  u.Estatus === 'CONCLUIDO',
            primary:  u.Estatus  === 'SINAFECTAR',
            warning: u.Estatus  === 'PENDIENTE',
            secondary: u.Estatus === 'BORRADOR',
            danger: u.Estatus === 'CANCELADO'
          })} 
          className="fs--2" 
          >
            {u.Estatus}
            <FontAwesomeIcon
              icon={getStatusIcon(u.Estatus)}
              transform="shrink-2"
              className="ms-1"
            />

          </SubtleBadge>
        ),
        horario: u.Horario,
        ruta: u.Ruta,
        vehiculo: u.Vehiculo,
        equipo: u.Equipo,
        plazasDisp: u.PlazasDisponibles,
        priority: {
            title: u.Situacion,
            color: '#'+u.Color,
            data: u.PorcentajeSituacion
        },
        id: u.ID
      }));
      setResult(prevResult => {
        if (JSON.stringify(prevResult) !== JSON.stringify(transformedData)) {
          return transformedData;
        }
        return prevResult;
      });
    }
  },[ruta])

  const getStatusIcon = (estatus) => {
    switch (estatus) {
      case 'CONCLUIDO':
        return faCheck;
      case 'BORRADOR':
        return faPen;
      case 'PENDIENTE':
        return faStream;
      case 'CANCELADO':
        return faBan;
      case 'SINAFECTAR':
        return faSpinner;
      default:
        return faPaperPlane;
    }
  };

  const handleClick = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = {
      EmpresaID: user.EmpresaID,
      PersonaID: user.ID
    };

    try {
      await newRuta({ data });
    } catch (error) {
      toast.error('Hubo un error al crear la ruta', { theme: 'colored' });
    }
  };
  
  useEffect(() => {
    if (response && response.status === 200) {
      toast[response.data[0].Tipo](response.data[0].Mensaje, { 
        theme: 'colored'
      });
      if(response.data[0].Ok === 0)
      {
        setTimeout(() => {
          navigate(`/logistica/rutas/rutasD/${response.data[0].NID}`);
        }, 1000);
      }
    }
  },[response])

  const handleRowClick = (id) => {
    navigate(`/logistica/rutas/view-rutas/${id}`);
  };

  return (
    <Row className="gx-3">
        <Col>
            <AdvanceTableWrapper
            columns={columns}
            data={result}
            selection
            selectionColumnWidth={52}
            sortable
            pagination
            perPage={10}
            rowCount={result.length}
            >
            <Card>
                <Card.Header className="border-bottom border-200 px-0">
                <AllReservasHeader
                    table
                    layout={layout}
                    handleShow={handleShow}
                    handleClick={handleClick}
                    isLoading={isLoading}
                />
                </Card.Header>
                <Card.Body className="p-0">
                <TableRowClick
                    table
                    headerClassName="bg-body-tertiary align-middle"
                    rowClassName="align-middle white-space-nowrap"
                    onRowClick={(id) => handleRowClick(id)} 
                    tableProps={{
                    bordered: false,
                    className: 'fs--1 mb-0 overflow-hidden'
                    }}
                />
                </Card.Body>
                <Card.Footer>
                <AdvanceTablePagination table />
                </Card.Footer>
            </Card>
            </AdvanceTableWrapper>
        </Col>
        <Col xxl={2} xl={3}>
            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                className="dark__bg-card-dark"
            >
                <Offcanvas.Header closeButton className="bg-body-tertiary">
                <h6 className="fs-0 mb-0 fw-semi-bold">Filtros</h6>
                </Offcanvas.Header>
                <ReservaFilterForm movimientos={movimientos} estatus={estatus} setFilter={setFilter} usuarios={usuarios} situaciones={situaciones} filter={filter} />
            </Offcanvas>
        </Col>
    </Row>
  );
}

export default TableRutas;
