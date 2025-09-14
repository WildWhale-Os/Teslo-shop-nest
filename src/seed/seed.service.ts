import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async executeSeed() {
    await this.deleteTables();
    const user = await this.insertUser();
    await this.insertNewProducts(user);
    return 'seed executed';
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();
    await this.userRepo.deleteAll();
  }

  private async insertUser() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(
        this.userRepo.create({
          ...user,
        }),
      );
    });

    const dbUser = await this.userRepo.save(users);
    return dbUser[0];
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises: any[] = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
