import { Pipe, PipeTransform } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  constructor(private config: PrimeNGConfig) {}

  transform(value: number): unknown {
    const k = 1024;
    const dm = 1;
    const sizes = this.config.translation.fileSizeTypes;

    if (value === 0) {
      return `0 ${sizes![0]}`;
    }

    const i = Math.floor(Math.log(value) / Math.log(k));
    const formattedSize = parseFloat((value / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes![i]}`;
  }
}
