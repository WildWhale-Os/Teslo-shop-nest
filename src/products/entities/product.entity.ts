import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/// puede ser remombrada las tablas por medio de @Entity({name: <nombre-tabla>})
@Entity()
export class Product {
  @ApiProperty({ uniqueItems: true, description: 'Product UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Product title', uniqueItems: true })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({ description: 'Product price' })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({ description: 'Product description', nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product slug - for SEO',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    default: 0,
    description: 'Product stock',
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    description: 'Product sizes',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    examples: ['Male', 'Female', 'Unisex'],
  })
  @Column({
    type: 'text',
  })
  gender: string;

  @ApiProperty({
    isArray: true,
    default: [],
    description: 'Product tags',
  })
  @Column({
    type: 'text',
    default: [],
  })
  tags: string[];

  @ApiProperty({
    isArray: true,
    type: ProductImage,
    description: 'Product Images',
  })
  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
    nullable: false,
    cascade: false,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .replaceAll(/\s+/g, '_')
      .replaceAll(/'/g, '')
      .toLowerCase();
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .replaceAll(/\s+/g, '_')
      .replaceAll(/'/g, '')
      .toLowerCase();
  }
}
