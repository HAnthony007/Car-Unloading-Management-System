<?php
// app/Application/UseCases/Discharge/CreateDischargeUseCase.php
class CreateDischargeUseCase
{
    public function __construct(
        private DischargeRepositoryInterface $dischargeRepository,
        private VehicleRepositoryInterface $vehicleRepository
    ) {}

    public function execute(CreateDischargeDTO $dto): Discharge
    {
        // Validation métier
        if (!$this->vehicleRepository->isExpectedInPortCall(
            $dto->vin, 
            $dto->portCallId
        )) {
            throw new VehicleNotExpectedException();
        }

        // Création via le repository
        return $this->dischargeRepository->create([
            'vin' => $dto->vin,
            'port_call_id' => $dto->portCallId,
            'agent_id' => $dto->agentId,
            'photo_data' => $dto->photoData
        ]);
    }
}