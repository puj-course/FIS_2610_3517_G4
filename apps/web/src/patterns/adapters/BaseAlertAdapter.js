export default class BaseAlertAdapter {
  adapt() {
    throw new Error('El adapter debe implementar adapt().');
  }

  normalize(result) {
    if (Array.isArray(result)) return result;
    if (result) return [result];
    return [];
  }

  adaptMany(items = []) {
    return items.flatMap((item) => this.normalize(this.adapt(item)));
  }
}