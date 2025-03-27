Create table Ciudadanos(
	CURP char(18) primary key not null,
	Nombre varchar(30) not null,
	APaterno varchar(15) not null,
	AMaterno varchar(15) not null,
	FechaNac date not null,
	Sexo char(1) not null,
	Direccion varchar(100) not null,
	Foto text,
	Vive char(1) not null,
	pwd text not null
);

Create table Vehiculos(
	Matricula varchar(7)primary key not null,
	Modelo varchar(30) not null,
	Marca varchar(30) not null,
	Año int not null,
	Tipo varchar(20),
	Descripcion varchar(50),
	Nacionalidad varchar(15),
	curpFK char(18) not null
);

Create table Condena(
	ID_Condena Serial primary key,
	Fecha_I date not null,
	Duracion int not null,
	Importe decimal not null,
	Estatus char(1) not null,
	id_tipocondenaFK int 
);

Create table TipoCondena(
	ID_TipoCondena Serial primary key,
	Tipo varchar(50)
);

Create table Agentes(
	N_Placa char(8) primary key not null,
	Nombre varchar(30) not null,
	APaterno varchar(15) not null,
	AMaterno varchar(15) not null,
	Sexo char(1) not null,
	Dept varchar(30) not null,
	Rango varchar(50) not null,
	pwd text not null
);

Create table GeneraB(
	Folio_BC varchar(10) primary key not null,
	Clasi char(1) not null,
	Cantidad decimal not null,
	curpFK char(18),
	id_condenaFK int
);

Create table CodigoPenal(
	N_Articulo int primary key not null,
	NombreArt varchar(30) not null,
	Descripcion varchar(100) not null,
	Periodo varchar(30) not null,
	Importe decimal not null
);

 alter table Vehiculos add foreign key (curpFK) references Ciudadanos(CURP);
 alter table Condena add foreign key (id_tipocondenaFK) references TipoCondena(ID_TipoCondena);
 alter table GeneraB add foreign key (id_condenaFK) references Condena(ID_Condena);
 alter table GeneraB add foreign key (curpFK) references Ciudadanos(CURP);

--MongoDB

--Create table Informes(
--	Folio varchar(10) primary key not null,
--	Descripcion varchar(50) not null,
--	Fecha datetime not null,
--	Direccion varchar(100) not null,
--	Foto text,
--	Estatus char(1) not null,
--	curpFK char(18),
--	id_condenaFk int
--  n_placa varchar(10)
--)

--Create table AgenteInfo(
--	ID_AgenteInfo int primary key identity(1,1),
--	n_placa char(8),
--	folioFK varchar(10)
--)

--Create table InfoCod(
--	ID_InfoCod int primary key identity(1,1),
--	folioFK varchar(10),
--	n_articulo int
--)

insert into Ciudadanos (CURP, Nombre, APaterno, AMaterno, FechaNac, Sexo, Direccion, Foto, Vive) values
('MEFL030925HDGDRSA1', 'Luis', 'Medrano', 'Fernández', '2003-09-25', 'M', 'Calle 40 1619', null, 'S'),
('LIFO030323HDGRLSA8', 'Adrian', 'Lira', 'Flores', '2003-03-23', 'M', 'Pollos Hermanos', null, 'S'),
('ROMJ030511HDGBNA4', 'Jesús', 'Robles', 'Mendoza', '2003-05-11', 'M', 'Las Canchas Luna', null, 'S');

insert into Vehiculos(Matricula,Modelo,Marca,Tipo,Descripcion,Nacionalidad,curpFK,Año) values
('FZR224D','3','Mazda','Vehiculo','Vehiculo de color blanco','Mexicano','MEFL030925HDGDRSA1',2010),
('GDA256C','Compass','Jeep','Camioneta','Vehiculo de color negro','Mexicano','LIFO030323HDGRLSA8',2014),
('AHC156D','Sentra','Nissan','Vehiculo','Vehiculo de color amarillo','Mexicano','ROMJ030511HDGBNA4',2004);

insert into CodigoPenal (N_Articulo, NombreArt, Descripcion, Periodo, Importe) values  
(367, 'Robo', 'Se sanciona el apoderamiento de una cosa ajena sin consentimiento.','6 meses a 6 años', 20000.00),  
(209, 'Fraude', 'Quien engañe para obtener un beneficio ilícito será sancionado.','3 meses a 3 años', 15000.00),  
(136, 'Homicidio', 'Al que prive de la vida a otro en riña','6 a 16 años', 240000.00);

insert into Agentes (N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango,pwd) values
('A000000T', 'Ariel', 'del Llano', 'Carlos', 'M', 'Transito', 'comandante','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq'),
('F000001F', 'Francisco', 'Palacios', 'Peñaloza', 'M','Fuerzas Especiales', 'jefe de policia','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq'),
('G000002T', 'Gabriel', 'de Santiago', 'Saavedra', 'M', 'Transito', 'official','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq');

Insert into TipoCondena(Tipo) values 
('Derecho a fianza'),
('Arresto Domiciliario'),
('Carcel'),
('Pension Alimenticia');

insert into Condena(Fecha_I,Duracion,Importe,Estatus,id_tipocondenaFK) values
('2025-03-11',6,240000.00,'P',3),
('2024-05-15',3,15000.00,'P',2),
('2025-01-09',1,10000.00,'P',1),
('2025-02-10',8,1000.00,'P',4)

Insert into GeneraB(Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK) values
('0000000000', 'A', '0', 'MEFL030925HDGDRSA1',2),
('0000000001', 'M', '0', 'LIFO030323HDGRLSA8',1),
('0000000002', 'B', '0', 'ROMJ030511HDGBNA4',3);

select * from Ciudadanos;
select * from Vehiculos;
select * from CodigoPenal;
select * from Agentes;
select * from TipoCondena;
select * from GeneraB;
select * from Condena;