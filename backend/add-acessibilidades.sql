-- Inserir acessibilidades que faltam (se não existirem)
INSERT INTO "Acessibilidade" ("descricao", "createdAt", "updatedAt")
VALUES 
  ('Rampas de acesso', NOW(), NOW()),
  ('Sanitários adaptados', NOW(), NOW()),
  ('Piso tátil', NOW(), NOW()),
  ('Mobiliário adaptado', NOW(), NOW()),
  ('Vagas de estacionamento reservadas', NOW(), NOW()),
  ('Portas largas', NOW(), NOW()),
  ('Corrimãos', NOW(), NOW()),
  ('Iluminação adequada', NOW(), NOW()),
  ('Sinalização visual e tátil', NOW(), NOW()),
  ('Audiodescrição', NOW(), NOW()),
  ('Legendas em vídeos', NOW(), NOW())
ON CONFLICT ("descricao") DO NOTHING;
