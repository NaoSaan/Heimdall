Create schema defaultdb;
use defaultdb;

Create table Ciudadanos(
	CURP char(18) primary key not null,
	Nombre varchar(100) not null,
	APaterno varchar(100) not null,
	AMaterno varchar(100) not null,
	FechaNac datetime not null,
	Sexo char(1) not null,
	Direccion varchar(1000) not null,
	Foto text,
	Vive char(1) not null
);

Create table Vehiculos(
	Matricula varchar(7)primary key not null,
	Modelo varchar(30) not null,
	Marca varchar(30) not null,
	Año int not null,
	Tipo varchar(20),
	Descripcion varchar(1000),
	Nacionalidad varchar(100),
	curpFK char(18) not null
);

Create table Condena(
	ID_Condena int primary key auto_increment,
	Fecha_I datetime not null,
	Duracion int not null,
	Importe decimal not null,
	Estatus char(1) not null,
	id_tipocondenaFK int 
);

Create table TipoCondena(
	ID_TipoCondena int primary key auto_increment,
	Tipo varchar(50)
);

Create table Agentes(
	N_Placa char(8) primary key not null,
	Nombre varchar(100) not null,
	APaterno varchar(100) not null,
	AMaterno varchar(100) not null,
	Sexo char(1) not null,
	Dept varchar(100) not null,
	Rango varchar(100) not null,
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
	NombreArt varchar(100) not null,
	Descripcion varchar(1000) not null,
	Periodo_I_Dias int not null,
    Periodo_F_Dias int not null,
	Importe decimal not null
);

alter table Vehiculos add foreign key (curpFK) references Ciudadanos(CURP);

alter table Condena add foreign key (id_tipocondenaFK) references TipoCondena(ID_TipoCondena);

alter table GeneraB add foreign key (id_condenaFK) references Condena(ID_Condena);

alter table GeneraB add foreign key (curpFK) references Ciudadanos(CURP);

insert into Ciudadanos (CURP, Nombre, APaterno, AMaterno, FechaNac, Sexo, Direccion, Foto, Vive) values
('MEFL030925HDGDRSA1', 'Luis', 'Medrano', 'Fernández', '2003-09-25', 'M', 'Calle 40 1619', 'Ruta/Foto', 'S'),
('LIFO030323HDGRLSA8', 'Adrian', 'Lira', 'Flores', '2003-03-23', 'M', 'Pollos Hermanos', 'Ruta/Foto', 'S'),
('ROMJ030511HDGBNAR4', 'Jesús', 'Robles', 'Mendoza', '2003-05-11', 'M', 'Las Canchas Luna', 'Ruta/Foto', 'S');

insert into Vehiculos(Matricula,Modelo,Marca,Tipo,Descripcion,Nacionalidad,curpFK,Año) values
('FZR224D','3','Mazda','Vehiculo','Vehiculo de color blanco','Mexicano','MEFL030925HDGDRSA1',2010),
('GDA256C','Compass','Jeep','Camioneta','Vehiculo de color negro','Mexicano','LIFO030323HDGRLSA8',2014),
('AHC156D','Sentra','Nissan','Vehiculo','Vehiculo de color amarillo','Mexicano','ROMJ030511HDGBNAR4',2004);

insert into CodigoPenal (N_Articulo, NombreArt, Descripcion, Periodo_I_Dias , Periodo_F_Dias, Importe) values  
(367, 'Robo', 'Se sanciona el apoderamiento de una cosa ajena sin consentimiento.',30,150, 20000.00),  
(209, 'Fraude', 'Quien engañe para obtener un beneficio ilícito será sancionado.',15,90, 15000.00),  
(136, 'Homicidio', 'Al que prive de la vida a otro en riña',150,1200, 240000.00);

insert into Agentes (N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango,pwd) values
('A000000T', 'Ariel', 'del Llano', 'Carlos', 'M', 'Transito', 'comandante','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq'),
('F000001F', 'Francisco', 'Palacios', 'Peñaloza', 'M','Fuerzas Especiales', 'jefe de policia','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq'),
('G000002T', 'Gabriel', 'de Santiago', 'Saavedra', 'M', 'Transito', 'oficial','$2b$10$XApdznvQdeGkoC4QeDtW.OJbMZKXQjHse1ctSWLhE00Q0iyA1UeVq');

Insert into TipoCondena(Tipo) values 
('Derecho a fianza'),
('Arresto Domiciliario'),
('Carcel'),
('Pension Alimenticia');

insert into Condena(Fecha_I,Duracion,Importe,Estatus,id_tipocondenaFK) values
('2025-03-11',6,240000.00,'P',3),
('2024-05-15',3,15000.00,'P',2),
('2025-01-09',1,10000.00,'P',1),
('2025-02-10',8,1000.00,'P',4);

Insert into GeneraB(Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK) values
('0000000000', 'A', '0', 'MEFL030925HDGDRSA1',2),
('0000000001', 'M', '0', 'LIFO030323HDGRLSA8',1),
('0000000002', 'B', '0', 'ROMJ030511HDGBNAR4',3);

select * from Ciudadanos;
select * from Vehiculos;
select * from CodigoPenal;
select * from Agentes;
select * from TipoCondena;
select * from GeneraB;
select * from Condena;