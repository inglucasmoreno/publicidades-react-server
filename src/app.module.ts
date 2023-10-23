import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConstants } from './modules/auth/constants';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { InicializacionModule } from './modules/inicializacion/inicializacion.module';
import { UnidadesMedidaModule } from './modules/unidades-medida/unidades-medida.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ImagenesModule } from './modules/imagenes/imagenes.module';
import { PublicidadesModule } from './modules/publicidades/publicidades.module';
import { PublicidadesProductosModule } from './modules/publicidades-productos/publicidades-productos.module';
import { CartaModule } from './modules/carta/carta.module';
import { CartasDigitalesModule } from './modules/cartas-digitales/cartas-digitales.module';
import { CartasSeccionesModule } from './modules/cartas-secciones/cartas-secciones.module';
import { SeccionesSubseccionesModule } from './modules/secciones-subsecciones/secciones-subsecciones.module';
import { SubseccionesProductosModule } from './modules/subsecciones-productos/subsecciones-productos.module';

@Module({
  imports: [

    // Directorio publico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    // Variables de entorno
    ConfigModule.forRoot({ 
      // envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true 
    }),

    // Autenticacion -> JsonWebToken
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' }
    }),

    // Conexion a base de datos
    
    // Custom modules
    AuthModule,
    UsuariosModule,
    InicializacionModule,
    UnidadesMedidaModule,
    ProductosModule,
    ImagenesModule,
    PublicidadesModule,
    PublicidadesProductosModule,
    CartaModule,
    CartasDigitalesModule,
    CartasSeccionesModule,
    SeccionesSubseccionesModule,
    SubseccionesProductosModule,

  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService){
    AppModule.port = +this.configService.get('PORT');
  }
}
