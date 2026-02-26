String.prototype.toCapitalized = function (): string {
  return this.toLowerCase().charAt(0).toUpperCase() + this.toLowerCase().slice(1);
};
