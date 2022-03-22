import { container } from 'inversify-props'
import { Service } from '@/utils/axios'
import {
  IUserService,
  IColorsService,
  ICategoriesService,
  ISizesService,
  ICatalogService,
  IFileUploader,
  IOrdersService,
  IShipmentService,
} from '@/services/interfaces'
import {
  CatalogService,
  CategoriesService,
  ColorsService,
  FileUploaderService,
  SizesService,
  UserService,
  OrdersService,
  ShipmentService,
} from '@/services'
import { AxiosInstance } from 'axios'
import { ConsoleLoggerFactory, ILoggerFactory } from '@/utils/loggerFactory'

container.bind<AxiosInstance>('AxiosService').toConstantValue(Service)
container.addSingleton<ILoggerFactory>(ConsoleLoggerFactory, 'LoggerFactory')
container.addSingleton<IOrdersService>(OrdersService)
container.addSingleton<IShipmentService>(ShipmentService)
container.addSingleton<ICatalogService>(CatalogService)
container.addSingleton<IUserService>(UserService)
container.addSingleton<IColorsService>(ColorsService)
container.addSingleton<ICategoriesService>(CategoriesService)
container.addSingleton<ISizesService>(SizesService)
container.addSingleton<IFileUploader>(FileUploaderService)
