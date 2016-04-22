
export default class extends saasplat.command.handler{
  run(command){
    this.repository.save(this.domain.get('warehouse').create(command.name));
  }
}
